<?php

namespace App\Services;

use App\Events\Machines\MachineCloneBatchFinished;
use App\Jobs\Machines\CloneMachineJob;
use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Machines\Machine;
use App\Models\Machines\MachineCategory;
use App\Models\Machines\MachineHardware;
use App\Models\Machines\MachineHardwareHistory;
use App\Models\Machines\MachineStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Support\FlashMsg;
use Carbon\Carbon;
use Exception;
use Illuminate\Bus\Batch;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

class MachineService
{
    public function searchMachines(array $filters): array
    {
        $term = strip_tags($filters['search'] ?? '');
        $paginated = Machine::query()
            ->with(['manufacturer', 'status'])
            ->withCount('machineHardwares')
            ->search($term)
            ->latest()
            ->paginate(10);

        return [
            'listMachines' => $paginated->items(),
            'pagination' => [
                'currentPage' => $paginated->currentPage(),
                'lastPage' => $paginated->lastPage(),
                'perPage' => $paginated->perPage(),
                'totalItems' => $paginated->total(),
            ],
        ];
    }

    public function getAllCreationComplements(array $filters = []): array
    {
        $result = [];
        try {
            $term = strip_tags($filters['hw_search'] ?? '');
            $paginated = Hardware::whereDoesntHave('machineHardware')
                ->with(['category', 'manufacturer'])
                ->search($term)
                ->orderBy('name')
                ->paginate(20);

            $result = [
                'categories' => MachineCategory::orderBy('name')->get(['id', 'name']),
                'manufacturers' => Manufacturer::orderBy('name')->get(['id', 'name']),
                'hardwares' => $paginated->items(),
                'hw_total' => $paginated->total(),
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou resgatar complementos de criação de máquinas! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function loadFullMachine(Machine $machine): ?Machine
    {
        try {
            return $machine->load([
                'category:id,name',
                'manufacturer:id,name',
                'status:id,name',
                'createdBy:id,name',
                'updatedBy:id,name',
                'machineHardwares.hardware.category',
                'machineHardwares.hardware.manufacturer',
                'machineHardwares.hardware.status',
            ])->setRelation('hardware_histories', MachineHardwareHistory::query()
                ->where('machine_id', $machine->id)
                ->orWhere('previous_machine_id', $machine->id)
                ->with([
                    'hardware:id,name',
                    'machine:id,name',
                    'previousMachine:id,name',
                    'createdBy:id,name',
                ])
                ->latest('modified_at')
                ->get());

        } catch (Exception $exc) {
            LogService::error(
                "Falhou resgatar as informações completa da máquina #{$machine->id}! ERROR: {$exc->getMessage()}"
            );

            return null;
        }
    }

    public function loadDataEditMachine(Machine $machine, array $filters = []): array
    {
        $result = [];
        try {
            $hwFields = ['id', 'name', 'serial_number', 'inventory_number', 'category_id', 'manufacturer_id'];
            $hwRelations = ['category:id,name', 'manufacturer:id,name'];
            $machine->load([
                'machineHardwares.hardware' => fn ($q) => $q->select($hwFields)->with($hwRelations),
                'category:id,name',
                'status',
                'manufacturer:id,name',
            ]);
            $term = strip_tags($filters['hw_search'] ?? '');
            $paginated = Hardware::select($hwFields)
                ->where(function ($q) use ($machine) {
                    $q->whereDoesntHave('machineHardware')
                        ->orWhereHas('machineHardware', fn ($q2) => $q2->where('machine_id', $machine->id)
                        );
                })
                ->with($hwRelations)
                ->search($term)
                ->orderByRaw('
                    CASE
                        WHEN EXISTS (
                            SELECT 1 FROM machine_has_hardwares
                            WHERE machine_has_hardwares.hardware_id = hardwares.id
                            AND machine_has_hardwares.machine_id = ?
                        ) THEN 0
                        ELSE 1
                    END ASC,
                    name ASC
                ', [$machine->id])
                ->paginate(30);

            $result = [
                'machine' => $machine,
                'categories' => MachineCategory::orderBy('name')->get(['id', 'name']),
                'manufacturers' => Manufacturer::orderBy('name')->get(['id', 'name']),
                'hardwares' => $paginated->items(),
                'hw_total' => $paginated->total(),
            ];
        } catch (Exception $exc) {
            LogService::error(
                "Falhou resgatar dados para edição da máquina #{$machine->id}! ERROR: {$exc->getMessage()}"
            );
        }

        return $result;
    }

    public function storeMachine(array $propsMachine, array $hardwares, bool $template): ?Machine
    {
        try {
            $creator = ['created_by' => Auth::id(), 'updated_by' => Auth::id()];
            $machine = DB::transaction(function () use ($propsMachine, $creator, $hardwares, $template) {
                $status = $template ? MachineStatus::templateStatus() : MachineStatus::storageStatus();
                $status = $status->firstOrFail();
                $propsMachine = array_merge($propsMachine, $creator, ['status_id' => $status->id]);
                $machine = Machine::create($propsMachine);
                if (! empty($hardwares)) {
                    $this->linkMachineHardwares(collect($hardwares), $machine->id, $creator, null);
                }

                return $machine;
            });

            LogService::created("Cadastrou uma nova máquina #{$machine->id} com Sucesso! ");

            return $machine;
        } catch (Exception $exc) {
            LogService::error("Falhou em cadastrar uma nova máquina! ERROR: {$exc->getMessage()}");

            return null;
        }
    }

    public function updateMachine(array $newProps, array $hardwares, Machine $machine, ?string $notes = null): array
    {
        $result = [];
        try {
            DB::transaction(function () use ($newProps, $hardwares, $machine, $notes) {
                $creator = ['created_by' => Auth::id(), 'updated_by' => Auth::id()];
                $machine->update([...$newProps, 'updated_by' => Auth::id()]);

                $hardwares = collect($hardwares ?? []);
                $currentHardwares = $machine->machineHardwares()->pluck('hardware_id');
                $toLink = $hardwares->diff($currentHardwares);
                $toUnlink = $currentHardwares->diff($hardwares)->toArray();

                if ($toLink->isNotEmpty()) {
                    $this->linkMachineHardwares($toLink, $machine->id, $creator, $notes);
                }

                if (! empty($toUnlink)) {
                    $this->unlinkMachineHardwares($toUnlink, $machine, $notes);
                }

                return $machine;
            });

            $result = $machine->toArray();
            LogService::created("Atualizou a máquina #{$machine->id} com Sucesso! ");
        } catch (Exception $exc) {
            LogService::error("Falhou em atualizar a máquina #{$machine->id}! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function deactivateMachine(Machine $machine): array
    {
        $message = FlashMsg::error('Não foi possivel realizar a desativação da Máquina!');
        try {
            $machine->update([
                'updated_by' => Auth::id(),
                'deleted_at' => Carbon::now(),
            ]);

            $message = FlashMsg::success("Desativação da Máquina#{$machine->id} realizada com Sucesso!");
            LogService::deactivate("Desativou a Máquina #{$machine->id} com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em desativar a Máquina #{$machine->id}! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }

    public function searchMachinesForTemplate(array $filters): array
    {
        $result = [];
        try {
            $term = strip_tags($filters['search'] ?? '');
            $template = MachineStatus::templateStatus()->first();
            $paginated = Machine::query()
                ->with(['manufacturer', 'status', 'category'])
                ->withCount('machineHardwares')
                ->where('status_id', $template->id)
                ->search($term)
                ->latest()
                ->paginate(10);

            $result = [
                'listMachines' => $paginated->items(),
                'pagination' => [
                    'currentPage' => $paginated->currentPage(),
                    'lastPage' => $paginated->lastPage(),
                    'perPage' => $paginated->perPage(),
                    'totalItems' => $paginated->total(),
                ],
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou ao buscar máquinas para template! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function dispatchCloneBatch(Machine $source, int $copies): bool
    {
        try {
            $userId = Auth::id();
            $jobs = collect(range(1, $copies))
                ->map(fn () => new CloneMachineJob($source->id, $userId))
                ->toArray();

            $machineName = $source->name;

            Bus::batch($jobs)
                ->name("clone-machine-{$source->id}")
                ->finally(function (Batch $batch) use ($userId, $machineName) {
                    broadcast(new MachineCloneBatchFinished(
                        userId: $userId,
                        machineName: $machineName,
                        total: $batch->totalJobs,
                        failed: $batch->failedJobs,
                    ));
                })
                ->dispatch();

            return true;
        } catch (Exception $exc) {
            LogService::error(
                "Falhou ao despachar batch de clonagem da máquina #{$source->id}! ERROR: {$exc->getMessage()}"
            );

            return false;
        }
    }

    public function updateAvaliable(Machine $machine): bool
    {
        try {
            $linkedStatus = MachineStatus::linkedStatus()->first();

            return $machine->status_id !== $linkedStatus->id;
        } catch (Exception $exc) {
            LogService::error(
                "Falhou ao validar se a edição da máquina está disponivel! ERROR: {$exc->getMessage()}"
            );

            return false;
        }
    }

    public function cloneAvaliable(Machine $machine): bool
    {
        try {
            $template = MachineStatus::templateStatus()->first();
            if ($machine->status_id !== $template->id) {
                return false;
            }

            return true;
        } catch (Exception $exc) {
            LogService::error(
                "Falhou ao validar se a clonagem da máquina está disponivel! ERROR: {$exc->getMessage()}"
            );

            return false;
        }
    }

    /**
     * Função apenas para isolar logica, nunca deve ser usada solta ou fora de uma transaction!!!
     */
    private function linkMachineHardwares(
        Collection $hardwaresIds,
        int $machineId,
        array $creator,
        ?string $notes = null
    ): void {
        DB::statement("SELECT set_config('app.hardware_notes', ?, true)", [$notes ?? '']);

        $hwLinkStatus = HardwareStatus::linkedStatus()->first();
        $data = $hardwaresIds->map(fn ($id) => [
            'machine_id' => $machineId,
            'hardware_id' => $id,
            ...$creator,
        ])->toArray();

        MachineHardware::insert($data);
        Hardware::whereIn('id', $hardwaresIds)->update([
            'status_id' => $hwLinkStatus->id,
            'updated_by' => Auth::id(),
        ]);
    }

    /**
     * Função apenas para isolar logica, nunca deve ser usada solta ou fora de uma transaction!!!
     */
    private function unlinkMachineHardwares(array $hardwaresIds, Machine $machine, ?string $notes = null): void
    {
        DB::statement("SELECT set_config('app.hardware_notes', ?, true)", [$notes ?? '']);

        $storageStatus = HardwareStatus::storageStatus()->first();
        $machine->machineHardwares()->whereIn('hardware_id', $hardwaresIds)->delete();
        Hardware::whereIn('id', $hardwaresIds)->update([
            'status_id' => $storageStatus->id,
            'updated_by' => Auth::id(),
        ]);
    }
}
