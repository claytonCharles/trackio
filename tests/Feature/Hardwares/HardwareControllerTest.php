<?php

namespace Tests\Feature\Hardwares;

use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
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

        $creator = [
            'created_by' => $this->managerUser->id,
            'updated_by' => $this->managerUser->id,
        ];

        HardwareStatus::create([...$creator, 'name' => 'testing']);
        HardwareCategory::create([...$creator, 'name' => 'tester']);
        Manufacturer::create([...$creator, 'name' => 'tester']);
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
                'status_id' => 1,
                'manufacturer_id' => 1,
                'name' => 'Tester Hardware',
                'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
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
                'status_id' => 1,
                'manufacturer_id' => 1,
                'name' => 'Tester Hardware',
                'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
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
                'status_id' => 10,
                'manufacturer_id' => 3,
                'name' => null,
                'description' => null,
            ]);

        $response->assertRedirectBack();
        $response->assertSessionHasErrors(['name', 'category_id', 'description', 'status_id', 'manufacturer_id']);
    }

    public function test_can_delete_hardware()
    {
        $this->actingAs($this->managerUser)
            ->post(route('hardwares.store'), [
                'category_id' => 1,
                'inventory_number' => null,
                'serial_number' => null,
                'status_id' => 1,
                'manufacturer_id' => 1,
                'name' => 'Tester Hardware',
                'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            ]);

        $response = $this
            ->actingAs($this->managerUser)
            ->delete(route('hardwares.destroy', ['hardware' => 1]));

        $response->assertRedirect(route('hardwares.index'));
        $response->assertSessionHas('flashMsg', 'Desativação do Hardware#1 realizada com Sucesso!');
    }

    public function test_cant_delete_hardware()
    {
        $this->actingAs($this->managerUser)
            ->post(route('hardwares.store'), [
                'category_id' => 1,
                'inventory_number' => null,
                'serial_number' => null,
                'status_id' => 1,
                'manufacturer_id' => 1,
                'name' => 'Tester Hardware',
                'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            ]);

        $response = $this
            ->actingAs($this->commomUser)
            ->delete(route('hardwares.destroy', ['hardware' => 1]));

        $response->assertForbidden();
    }
}
