<?php

namespace Tests\Feature\Hardwares;

use App\Models\Hardwares\HardwareCategory;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HardwareControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $managerUser;

    protected User $commomUser;

    protected function setUp(): void
    {
        parent::setUp();

        Permission::create(['name' => 'read hardwares', 'resource' => 'hardware']);
        Permission::create(['name' => 'write hardwares', 'resource' => 'hardware']);
        Permission::create(['name' => 'delete hardwares', 'resource' => 'hardware']);
        Role::create(['name' => 'manager'])->givePermissionTo(Permission::all());

        $this->commomUser = User::factory()->create();
        $this->managerUser = User::factory()->create();
        $this->managerUser->assignRole('manager');

        HardwareCategory::create([
            'user_id' => $this->managerUser->id,
            'name' => 'tester'
        ]);
    }

    public function test_hardware_list_page_is_displayed()
    {
        $response = $this
            ->actingAs($this->managerUser)
            ->get(route('hardwares.index'));

        $response->assertOk();
    }

    public function test_hardware_list_unauthorized()
    {
        $response = $this
            ->actingAs($this->commomUser)
            ->get(route('hardwares.index'));

        $response->assertForbidden();
    }

    public function test_hardware_can_store()
    {
        $response = $this
            ->actingAs($this->managerUser)
            ->post(route('hardwares.store'), [
                'category_id' => 1,
                'inventory_number' => null,
                'serial_number' => null,
                'name' => "Tester Hardware",
                'description' => "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            ]);
        
        $response->assertRedirect(route('hardwares.show', ['hardware' => 1]));
    }

    public function test_hardware_cant_store()
    {
        $response = $this
            ->actingAs($this->commomUser)
            ->post(route('hardwares.store'), [
                'category_id' => 1,
                'inventory_number' => null,
                'serial_number' => null,
                'name' => "Tester Hardware",
                'description' => "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            ]);
        
        $response->assertForbidden();
    }

    public function test_hardware_cant_store_wrong_data()
    {
        $response = $this
            ->actingAs($this->managerUser)
            ->post(route('hardwares.store'), [
                'category_id' => 100,
                'inventory_number' => null,
                'serial_number' => null,
                'name' => null,
                'description' => null
            ]);
        
        $response->assertRedirectBack();
    }
}

