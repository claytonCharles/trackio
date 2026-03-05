<?php

namespace Database\Seeders;

use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Machines\MachineStatus;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Permission::create(['name' => 'read roles', 'resource' => 'role']);
        Permission::create(['name' => 'write roles', 'resource' => 'role']);
        Permission::create(['name' => 'delete roles', 'resource' => 'role']);

        Permission::create(['name' => 'read manufacturers', 'resource' => 'manufacturer']);
        Permission::create(['name' => 'write manufacturers', 'resource' => 'manufacturer']);
        Permission::create(['name' => 'delete manufacturers', 'resource' => 'manufacturer']);

        Permission::create(['name' => 'read hardwares', 'resource' => 'hardware']);
        Permission::create(['name' => 'write hardwares', 'resource' => 'hardware']);
        Permission::create(['name' => 'delete hardwares', 'resource' => 'hardware']);

        Permission::create(['name' => 'read machines', 'resource' => 'machine']);
        Permission::create(['name' => 'write machines', 'resource' => 'machine']);
        Permission::create(['name' => 'delete machines', 'resource' => 'machine']);

        Role::create(['name' => 'admin', 'is_system_role' => true])->givePermissionTo(Permission::all());

        $userAdmin = User::factory()->create(['name' => 'Admin System', 'email' => 'admin@admin.com'])->assignRole('admin');
        $adminId = $userAdmin->id;
        $creator = ['created_by' => $adminId, 'updated_by' => $adminId];

        HardwareCategory::create([...$creator, 'name' => 'CPU', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'GPU', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'RAM', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'HDD', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'PSU', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Placa Mãe', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Monitor', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Acessórios', 'is_system_category' => true]);

        HardwareStatus::create([...$creator, 'name' => 'Vinculado', 'only_system' => true]);
        HardwareStatus::create([...$creator, 'name' => 'Armazenado']);
        HardwareStatus::create([...$creator, 'name' => 'Defeituoso']);
        HardwareStatus::create([...$creator, 'name' => 'Em Análise']);
        HardwareStatus::create([...$creator, 'name' => 'Em Garantia']);

        MachineStatus::create([...$creator, 'name' => 'Armazenado']);
        MachineStatus::create([...$creator, 'name' => 'Defeituoso']);
        MachineStatus::create([...$creator, 'name' => 'Em Uso']);
        MachineStatus::create([...$creator, 'name' => 'Em Espera']);
        MachineStatus::create([...$creator, 'name' => 'Em Garantia']);
    }
}
