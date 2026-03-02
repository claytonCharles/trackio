<?php

namespace App\Services;

use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
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
        $query = Hardware::with('category:id,name');
        if (! empty($filters['search'])) {
            $term = strip_tags($filters['search']);
            $query->where('name', 'LIKE', "%{$term}%")
                ->orWhere('inventory_number', 'LIKE', "%{$term}%")
                ->orWhere('serial_number', 'LIKE', "%{$term}%");
        }

        $paginated = $query
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
     * @param array $data
     * @param User $user
     * @return array
     */
    public function storeHardware(array $data, User $user): array
    {
        $result = [];
        try {
            $hardware = Hardware::create([
                'user_id' => $user->id,
                'category_id' => $data['category_id'],
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
     * @param array $data
     * @param string $id
     * @param User $user
     * @return array
     */
    public function updateHardware(array $data, string $id, User $user): array
    {
        $result = [];
        try {
            $hardware = Hardware::findOrFail($id);
            $data['user_id'] = $user->id;
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
     * @param string $id
     * @param User $user
     * @return string
     */
    public function deactivateHardware(string $id, User $user): string
    {
        $message = 'Não foi possivel realizar a desativação do Hardware!';
        try {
            $hardware = Hardware::findOrFail($id);
            $hardware->update([
                'user_id' => $user->id,
                'deleted_at' => Carbon::now(),
            ]);

            $message = "Desativação do Hardware#$id realizada com Sucesso!";
            LogService::deactivate("Desativou o Hardware #$id com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em desativar o Hardware #$id! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }


    /**
     * Lista as categorias de hardware existente.
     * @return array
     */
    public function getAllHardwareCategories(): array
    {
        $result = [];
        try {
            $result = HardwareCategory::all(['id', 'name'])->toArray();
        } catch(Exception $exc) {
            LogService::error("Falhou resgatar a listagem de Categorias de Hardware! ERROR: {$exc->getMessage()}");
        }
        return $result;
    }


    /**
     * Resgata as informações completa o hardware o buscando pelo id.
     * @param string $id
     * @return array
     */
    public function getHardwareInfoById(string $id): array
    {
        $result = [];
        try {
            $hardware = Hardware::with(['category:id,name', 'user:id,name'])->findOrFail($id);
            $result = $hardware->toArray();
        } catch(Exception $exc) {
            LogService::error("Falhou resgatar as informações do Hardware #$id! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }
}
