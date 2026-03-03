<?php

namespace App\Services;

use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Carbon\Carbon;
use Exception;

class ManufacturerService
{

    public function getAllManufactures(): array
    {
        $result = [];
        try {
            $result = Manufacturer::all(['id', 'name'])->toArray();
        } catch(Exception $exc) {
            LogService::error("Falhou resgatar a listagem de Fabricantes! ERROR: {$exc->getMessage()}");
        }
        return $result;
    }

    public function storeManufacturer(array $data, User $user)
    {
        $result = [];
        try {
            $manufacturer = Manufacturer::create([
                'created_by' => $user->id,
                'updated_by' => $user->id,
                'name' => $data['name'],
            ]);

            $result = $manufacturer->toArray();
            LogService::created("Cadastrou um novo Fabricante #{$result['id']} com Sucesso! ");
        } catch (Exception $exc) {
            LogService::error("Falhou em cadastrar um novo Fabricante! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function updateManufacturer(array $data, string $id, User $user): array
    {
        $result = [];
        try {
            $manufacturer = Manufacturer::findOrFail($id);
            $data['updated_by'] = $user->id;
            $manufacturer->update($data);
            $result = $manufacturer->toArray();

            LogService::updated("Atualizou o Fabricante #$id com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em atualizar o Fabricante #$id! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function deactivateManufacturer(string $id, User $user): string
    {
        $message = 'Não foi possivel realizar a desativação do Fabricante!';
        try {
            $manufacturer = Manufacturer::findOrFail($id);
            $manufacturer->update([
                'updated_by' => $user->id,
                'deleted_at' => Carbon::now(),
            ]);

            $message = "Desativação do Fabricante#$id realizada com Sucesso!";
            LogService::deactivate("Desativou o Fabricante #$id com Sucesso!");
        } catch (Exception $exc) {
            LogService::error("Falhou em desativar o Fabricante #$id! ERROR: {$exc->getMessage()}");
        }

        return $message;
    }
}