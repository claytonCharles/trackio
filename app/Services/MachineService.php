<?php

namespace App\Services;

use App\Models\Hardwares\Hardware;
use App\Models\Machines\Machine;
use App\Models\Machines\MachineHardware;
use App\Models\Machines\MachineHardwareHistory;
use App\Models\Machines\MachineStatus;
use App\Models\Manufacturers\Manufacturer;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
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
            $page = max(1, (int) ($filters['hw_page'] ?? 1));
            $perPage = 10;

            $paginated = Hardware::whereDoesntHave('machineHardware')
                ->with(['category', 'manufacturer'])
                ->search($term)
                ->orderBy('name')
                ->paginate($perPage, ['*'], 'page', $page);

            $result = [
                'statuses' => MachineStatus::orderBy('name')->get(['id', 'name']),
                'manufacturers' => Manufacturer::orderBy('name')->get(['id', 'name']),
                'hardwares' => $paginated->items(),
                'hw_has_more' => $paginated->hasMorePages(),
                'hw_total' => $paginated->total(),
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou resgatar complementos de criação de máquinas! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function loadFullMachine(Machine $machine)
    {
        $result = [];
        try {
            $machine->load([
                'manufacturer',
                'status',
                'createdBy:id,name',
                'updatedBy:id,name',
                'machineHardwares.hardware.category',
                'machineHardwares.hardware.manufacturer',
                'machineHardwares.hardware.status',
            ]);

            $histories = MachineHardwareHistory::query()
                ->where('machine_id', $machine->id)
                ->orWhere('previous_machine_id', $machine->id)
                ->with([
                    'hardware:id,name',
                    'machine:id,name',
                    'previousMachine:id,name',
                    'createdBy:id,name',
                ])
                ->latest('modified_at')
                ->get();

            $result = array_merge($machine->toArray(), [
                'hardware_histories' => $histories->toArray(),
            ]);
        } catch (Exception $exc) {
            LogService::error(
                "Falhou resgatar as informações completa da máquina #{$machine->id}! ERROR: {$exc->getMessage()}"
            );
        }

        return $result;
    }

    public function loadDataEditMachine(Machine $machine, array $filters = []): array
    {
        $result = [];
        try {
            $machine->load(['machineHardwares.hardware', 'status', 'manufacturer']);

            $term = strip_tags($filters['hw_search'] ?? '');
            $page = max(1, (int) ($filters['hw_page'] ?? 1));
            $perPage = 15;

            $paginated = Hardware::where(function ($q) use ($machine) {
                $q->whereDoesntHave('machineHardware')
                    ->orWhereHas('machineHardware', fn ($q2) => $q2->where('machine_id', $machine->id)
                    );
            })
                ->with(['category', 'manufacturer'])
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
                ->paginate($perPage, ['*'], 'page', $page);

            $result = [
                'machine' => $machine,
                'manufacturers' => Manufacturer::orderBy('name')->get(['id', 'name']),
                'statuses' => MachineStatus::orderBy('name')->get(['id', 'name']),
                'hardwares' => $paginated->items(),
                'hw_has_more' => $paginated->hasMorePages(),
                'hw_total' => $paginated->total(),
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou resgatar dados para edição da máquina #{$machine->id}! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function storeMachine(array $propsMachine, array $hardwares = []): string
    {
        $message = 'Não foi possivel realizar o cadastro da máquina!';
        try {
            $creator = ['created_by' => Auth::id(), 'updated_by' => Auth::id()];
            $machineId = DB::transaction(function () use ($propsMachine, $creator, $hardwares) {
                $machine = Machine::create(array_merge($propsMachine, $creator));

                foreach ($hardwares as $hardwareId) {
                    MachineHardware::create([
                        'machine_id' => $machine->id,
                        'hardware_id' => $hardwareId,
                        ...$creator,
                    ]);
                }

                return $machine->id;
            });

            $message = 'Nova máquina cadastrada com sucesso!';
            LogService::created("Cadastrou uma nova máquina #{$machineId} com Sucesso! ");
        } catch (Exception $exc) {
            LogService::error("Falhou em cadastrar uma nova máquina! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }

    public function updateMachine(array $newProps, array $hardwares, Machine $machine): string
    {
        $message = 'Não foi possivel realizar a atualização da máquina!';
        try {
            DB::transaction(function () use ($newProps, $hardwares, $machine) {
                $creator = ['created_by' => Auth::id(), 'updated_by' => Auth::id()];
                $machine->update([
                    ...$newProps,
                    'updated_by' => Auth::id(),
                ]);

                $hardwares = collect($hardwares ?? []);
                $currentHardwares = $machine->machineHardwares()->pluck('hardware_id');

                foreach ($hardwares->diff($currentHardwares) as $newHardware) {
                    MachineHardware::create([
                        'machine_id' => $machine->id,
                        'hardware_id' => $newHardware,
                        ...$creator,
                    ]);
                }

                $machine->machineHardwares()
                    ->whereIn('hardware_id', $currentHardwares->diff($hardwares))
                    ->delete();
            });

            $message = 'Atualização da máquina realizada com sucesso!';
            LogService::created("Atualizou a máquina #{$machine->id} com Sucesso! ");
        } catch (Exception $exc) {
            LogService::error("Falhou em atualizar a máquina #{$machine->id}! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }

    public function deactivateMachine(Machine $machine): string
    {
        $message = 'Não foi possivel realizar a desativação da Máquina!';
        try {
            $machine->update([
                'updated_by' => Auth::id(),
                'deleted_at' => Carbon::now(),
            ]);

            $message = "Desativação da Máquina#{$machine->id} realizada com Sucesso!";
            LogService::deactivate("Desativou a Máquina #{$machine->id} com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em desativar a Máquina #{$machine->id}! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }
}
