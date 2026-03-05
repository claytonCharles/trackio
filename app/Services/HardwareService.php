<?php

namespace App\Services;

use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
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
    public function storeHardware(array $data, User $user): array
    {
        $result = [];
        try {
            $hardware = Hardware::create([
                'created_by' => $user->id,
                'updated_by' => $user->id,
                'category_id' => $data['category_id'],
                'status_id' => $data['status_id'],
                'manufacturer_id' => $data['manufacturer_id'],
                'inventory_number' => $data['inventory_number'],
                'serial_number' => $data['serial_number'],
                'name' => $data['name'],
                'description' => $data['description'],
            ]);

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
    public function updateHardware(array $data, Hardware $hardware): array
    {
        $result = [];
        try {
            $hardware->update([
                ...$data,
                'updated_by' => Auth::id(),
            ]);

            $result = $hardware->toArray();
            LogService::updated("Atualizou o Hardware #{$hardware->id} com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em atualizar o Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}");
        }

        return $result;
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
                'listStatus' => HardwareStatus::all(['id', 'name', 'only_system'])->toArray(),
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou resgatar a listagem de Categorias de Hardware! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    /**
     * Carrega os dados completos do hardware desejado.
     */
    public function loadFullHardware(Hardware $hardware): array
    {
        $result = [];
        try {
            $hardware->load([
                'category:id,name',
                'status:id,name,only_system',
                'manufacturer:id,name',
                'createdBy:id,name',
                'updatedBy:id,name',
                'machineHardware.machine:id,name',
                'histories.category:id,name',
                'histories.status:id,name',
                'histories.manufacturer:id,name',
                'histories.updatedBy:id,name',
            ]);

            $result = [
                ...$hardware->toArray(),
                'updated_at_formatted' => $hardware->updated_at->subHour(3)->format('d/m/Y à\s H:i'),
                'machine' => $hardware->machineHardware?->machine
                    ? ['id' => $hardware->machineHardware->machine->id, 'name' => $hardware->machineHardware->machine->name]
                    : null,
                'histories' => $hardware->histories->map(fn ($h) => [
                    'id' => $h->id,
                    'name' => $h->name,
                    'serial_number' => $h->serial_number,
                    'inventory_number' => $h->inventory_number,
                    'description' => $h->description,
                    'modified_at' => Carbon::parse($h->modified_at)->subHour(3)->format('d/m/Y à\s H:i'),
                    'category' => $h->category,
                    'status' => $h->status,
                    'manufacturer' => $h->manufacturer,
                    'updated_by' => $h->updatedBy,
                ]),
            ];
        } catch (Exception $exc) {
            LogService::error(
                "Falhou resgatar as informações completa do Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}"
            );
        }

        return $result;
    }

    public function loadDataEditHardware(Hardware $hardware)
    {
        $result = [];
        try {
            $hardware->load([
                'category:id,name',
                'status:id,name,only_system',
                'manufacturer:id,name',
                'createdBy:id,name',
                'updatedBy:id,name',
            ]);

            $result = $hardware->toArray();
        } catch (Exception $exc) {
            LogService::error(
                "Falhou em carregar as informações do Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}"
            );
        }

        return $result;
    }

    public function canUpdateHardware(Hardware $hardware)
    {
        $result = false;
        try {
            $hardware->load(['status:id,name,only_system']);
            $result = !$hardware->status->only_system;
        } catch (Exception $exc) {
            LogService::error(
                "Falhou em validar o vinculo de Hardware #{$hardware->id}! ERROR: {$exc->getMessage()}"
            );
        }

        return $result;
    }
}
