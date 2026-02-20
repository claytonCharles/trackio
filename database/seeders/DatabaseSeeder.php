<?php

namespace Database\Seeders;

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

        Permission::create(['name' => 'read hardwares', 'resource' => 'hardware']);
        Permission::create(['name' => 'write hardwares', 'resource' => 'hardware']);
        Permission::create(['name' => 'delete hardwares', 'resource' => 'hardware']);

        Role::create([
            'name' => 'admin',
            'is_system_role' => true
        ])->givePermissionTo(Permission::all());

        Role::create(['name' => 'manager'])->givePermissionTo(
            Permission::where('resource', 'hardware')->get()
        );

        User::factory()->create([
            'name' => 'Admin System',
            'email' => 'admin@admin.com',
        ])->assignRole('admin');

        User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
        ])->assignRole('manager');
    }
}
