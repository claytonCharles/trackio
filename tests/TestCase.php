<?php

namespace Tests;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function createUser(): User
    {
        return User::factory()->create();
    }

    protected function createUserWithPermissions(array $permissions): User
    {
        $role = Role::create(['name' => 'role_' . uniqid()]);

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
            $role->givePermissionTo($permission);
        }

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }
}
