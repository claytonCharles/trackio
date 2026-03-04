<?php

namespace App\Services;

use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Carbon\Carbon;
use Exception;

class HardwareService
{
    public function __construct() {}

    /**
     * Lista os Hardwares disponiveis baseado nos filtros.
     */
    public function searchHardwares(array $filters): array
    {
        $term = strip_tags($filters['search'] ?? '');
        $paginated = Hardware::with(['category:id,name'])
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
    public function updateHardware(array $data, string $id, User $user): array
    {
        $result = [];
        try {
            $hardware = Hardware::findOrFail($id);
            $data['updated_by'] = $user->id;
            $hardware->update($data);
            $result = $hardware->toArray();

            LogService::updated("Atualizou o Hardware #$id com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em atualizar o Hardware #$id! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    /**
     * Desativa um hardware do sistema.
     * Desativações são apenas exclusão logica no sistema.
     */
    public function deactivateHardware(string $id, User $user): string
    {
        $message = 'Não foi possivel realizar a desativação do Hardware!';
        try {
            $hardware = Hardware::findOrFail($id);
            $hardware->update([
                'updated_by' => $user->id,
                'deleted_at' => Carbon::now(),
            ]);

            $message = "Desativação do Hardware#$id realizada com Sucesso!";
            LogService::deactivate("Desativou o Hardware #$id com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em desativar o Hardware #$id! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }

    public function getAllComplements(): array
    {
        $result = [];
        try {
            $result = [
                'listCategories' => HardwareCategory::all(['id', 'name'])->toArray(),
                'listStatus' => HardwareStatus::all(['id', 'name'])->toArray(),
                'listManufacturers' => Manufacturer::all(['id', 'name'])->toArray(),
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou resgatar a listagem de Categorias de Hardware! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    /**
     * Resgata as informações completa o hardware o buscando pelo id.
     */
    public function getHardwareInfoById(string $id): array
    {
        $result = [];
        try {
            $hardware = Hardware::with([
                'category:id,name',
                'status:id,name',
                'manufacturer:id,name',
                'createdBy:id,name',
                'updatedBy:id,name',
            ])->findOrFail($id);

            $result = $hardware->toArray();
        } catch (Exception $exc) {
            LogService::error("Falhou resgatar as informações do Hardware #$id! ERROR: {$exc->getMessage()}");
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
                'status:id,name',
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
}
