<?php

namespace Database\Seeders;

use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Machines\MachineCategory;
use App\Models\Machines\MachineStatus;
use App\Models\Manufacturers\Manufacturer;
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
        Permission::create(['name' => 'clone machines', 'resource' => 'machine']);

        Permission::create(['name' => 'read departments', 'resource' => 'department']);
        Permission::create(['name' => 'write departments', 'resource' => 'department']);
        Permission::create(['name' => 'delete departments', 'resource' => 'department']);

        Role::create(['name' => 'admin', 'is_system_role' => true])->givePermissionTo(Permission::all());

        $userAdmin = User::factory()->create(['name' => 'Admin System', 'email' => 'admin@admin.com'])->assignRole('admin');
        $adminId = $userAdmin->id;
        $creator = ['created_by' => $adminId, 'updated_by' => $adminId];

        HardwareCategory::create([...$creator, 'name' => 'Processador', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Placa de Vídeo', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Memória RAM', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Unidade de Armazenamento', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Fonte de Alimentação', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Placa Mãe', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Monitor', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Teclado', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Mouse', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Rede sem Fio', 'is_system_category' => true]);
        HardwareCategory::create([...$creator, 'name' => 'Acessórios', 'is_system_category' => true]);

        HardwareStatus::create([...$creator, 'name' => 'Vinculado', 'only_system' => true, 'is_machine_binding' => true]);
        HardwareStatus::create([...$creator, 'name' => 'Armazenado']);
        HardwareStatus::create([...$creator, 'name' => 'Defeituoso']);
        HardwareStatus::create([...$creator, 'name' => 'Em Análise']);
        HardwareStatus::create([...$creator, 'name' => 'Em Garantia']);

        MachineStatus::create(['name' => 'Vinculado', 'only_system' => true, 'tag' => 'linked']);
        MachineStatus::create(['name' => 'Armazenado', 'only_system' => true, 'tag' => 'storage']);
        MachineStatus::create(['name' => 'Defeituoso', 'only_system' => true, 'tag' => 'broken']);
        MachineStatus::create(['name' => 'Em Garantia', 'only_system' => true, 'tag' => 'guarantee']);

        MachineCategory::create([...$creator, 'name' => 'Desktop', 'is_system_category' => true]);
        MachineCategory::create([...$creator, 'name' => 'Notebook', 'is_system_category' => true]);
        MachineCategory::create([...$creator, 'name' => 'Microcomputador', 'is_system_category' => true]);
        MachineCategory::create([...$creator, 'name' => 'Workstation', 'is_system_category' => true]);

        Manufacturer::create([...$creator, 'name' => 'AMD']);
        Manufacturer::create([...$creator, 'name' => 'INTEL']);
        Manufacturer::create([...$creator, 'name' => 'NVIDIA']);
        Manufacturer::create([...$creator, 'name' => 'SAMSUNG']);
        Manufacturer::create([...$creator, 'name' => 'DELL']);
        Manufacturer::create([...$creator, 'name' => 'POSITIVO']);
        Manufacturer::create([...$creator, 'name' => 'LENOVO']);
        Manufacturer::create([...$creator, 'name' => 'GENÉRICO']);
    }
}
