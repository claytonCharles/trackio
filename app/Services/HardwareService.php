<?php

namespace App\Services;

use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Machines\MachineHardwareHistory;
use App\Models\Manufacturers\Manufacturer;
use App\Support\FlashMsg;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;

class HardwareService
{
    public function __construct() {}

    /**
     * Lista os Hardwares disponiveis baseado nos filtros.
     */
    public function searchHardwares(array $filters): array
    {
        $term = strip_tags($filters['search'] ?? '');
        $paginated = Hardware::with(['category:id,name', 'manufacturer:id,name', 'status:id,name'])
            ->search($term)
            ->orderBy('id')
            ->paginate(10);

        return [
            'listHardwares' => $paginated->items(),
            'pagination' => [
                'currentPage' => $paginated->currentPage(),
                'lastPage' => $paginated->lastPage(),
                'perPage' => $paginated->perPage(),
                'totalItems' => $paginated->total(),
            ],
        ];
    }

    /**
     * Cadastro de um Hardware no sistema.
     */
    public function storeHardware(array $data): array
    {
        $result = [];
        try {
            $storageStatus = HardwareStatus::storageStatus()->firstOrFail();
            $props = array_merge($data, [
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'status_id' => $storageStatus->id,
            ]);

            $hardware = Hardware::create($props);
            $result = $hardware->toArray();
            LogService::created("Cadastrou um novo Hardware #{$result['id']} com Sucesso! ");
        } catch (Exception $exc) {
            LogService::error("Falhou em cadastrar um novo hardware! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    /**
     * Atualiza um hardware existente no sistema.
     */
    public function updateHardware(array $data, Hardware $hardware): ?Hardware
    {
        try {
            $hardware->update([...$data, 'updated_by' => Auth::id()]);
            LogService::updated("Atualizou o Hardware #{$hardware->id}!");

            return $hardware;
        } catch (Exception $exc) {
            LogService::error("Falhou em atualizar o Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}");

            return null;
        }
    }

    /**
     * Desativa um hardware do sistema.
     * Desativações são apenas exclusão logica no sistema.
     */
    public function deactivateHardware(Hardware $hardware): array
    {
        $message = FlashMsg::error('Não foi possivel realizar a desativação do Hardware!');
        try {
            $hardware->update([
                'updated_by' => Auth::id(),
                'deleted_at' => Carbon::now(),
            ]);

            $message = FlashMsg::success("Desativação do Hardware#{$hardware->id} realizada com Sucesso!");
            LogService::deactivate("Desativou o Hardware #{$hardware->id} com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em desativar o Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }

    public function getAllCreationComplements(): array
    {
        $result = [];
        try {
            $result = [
                'listCategories' => HardwareCategory::all(['id', 'name'])->toArray(),
                'listManufacturers' => Manufacturer::all(['id', 'name'])->toArray(),
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou resgatar a listagem de Categorias de Hardware! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    /**
     * Carrega os dados completos do hardware desejado.
     */
    public function loadFullHardware(Hardware $hardware): ?Hardware
    {
        try {
            return $hardware->load([
                'category:id,name',
                'status:id,name',
                'manufacturer:id,name',
                'createdBy:id,name',
                'updatedBy:id,name',
                'machineHardware.machine:id,name',
                'histories.category:id,name',
                'histories.status:id,name',
                'histories.manufacturer:id,name',
                'histories.updatedBy:id,name',
            ])->setRelation('moveHistories', MachineHardwareHistory::query()
                ->where('hardware_id', $hardware->id)
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
                "Falhou em carregar as informações completa do Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}"
            );

            return null;
        }
    }

    public function loadDataEditHardware(Hardware $hardware): ?Hardware
    {
        try {
            return $hardware->load([
                'category:id,name',
                'status:id,name',
                'manufacturer:id,name',
                'createdBy:id,name',
                'updatedBy:id,name',
            ]);

        } catch (Exception $exc) {
            LogService::error(
                "Falhou em carregar as informações do Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}"
            );

            return null;
        }
    }

    public function checkUpdateEnable(Hardware $hardware): bool
    {
        $linkedStatus = HardwareStatus::linkedStatus()->firstOrFail();

        return $hardware->status_id === $linkedStatus->id;
    }
}
