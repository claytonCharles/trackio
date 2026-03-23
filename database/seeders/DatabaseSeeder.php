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
use Spatie\Permission\Guard;
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
        $permissions = ['roles', 'manufacturers', 'hardwares', 'departments'];

        $this->setupHardwareStatus();
        $this->setupMachineStatus();
        $this->setupPermissions($permissions);
        $this->setupPermissions(['machines'], ['clone']);

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

    private function setupHardwareStatus(): void
    {
        $data = [
            ['name' => 'Vinculado', 'tag' => 'linked'],
            ['name' => 'Armazenado', 'tag' => 'storage'],
            ['name' => 'Defeituoso', 'tag' => 'broken'],
            ['name' => 'Em Garantia', 'tag' => 'guarantee'],
        ];

        HardwareStatus::insert($data);
    }

    private function setupMachineStatus(): void
    {
        $data = [
            ['name' => 'Template', 'only_system' => true, 'tag' => 'template'],
            ['name' => 'Vinculado', 'only_system' => true, 'tag' => 'linked'],
            ['name' => 'Armazenado', 'only_system' => true, 'tag' => 'storage'],
            ['name' => 'Defeituoso', 'only_system' => true, 'tag' => 'broken'],
            ['name' => 'Em Garantia', 'only_system' => true, 'tag' => 'guarantee'],
        ];

        MachineStatus::insert($data);
    }

    private function setupPermissions(array $permissions, array $extraPrefixs = []): void
    {
        $prefix = array_merge(['read', 'write', 'delete'], $extraPrefixs);

        $data = [];
        foreach ($permissions as $permission) {
            foreach ($prefix as $rule) {
                $data[] = [
                    'name' => "$rule $permission",
                    'resource' => $permission,
                    'guard_name' => Guard::getDefaultName(static::class),
                ];
            }
        }

        Permission::insert($data);
    }
}
