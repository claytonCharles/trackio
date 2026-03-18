<?php

namespace Tests\Feature\Departments;

use App\Models\Departments\Department;
use App\Models\Departments\DepartmentMachine;
use App\Models\Machines\Machine;
use App\Models\Machines\MachineCategory;
use App\Models\Machines\MachineStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class DepartmentMachineControllerTest extends TestCase
{
    use RefreshDatabase;

    private const PERMISSIONS = [
        'read departments',
        'write departments',
        'delete departments',
    ];

    private User $fullUser;

    private User $writeUser;

    private User $deleteUser;

    private User $readUser;

    private User $commonUser;

    private Department $department;

    private MachineStatus $linkedStatus;

    private MachineStatus $storageStatus;

    private Manufacturer $manufacturer;

    private MachineCategory $machineCategory;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (self::PERMISSIONS as $permission) {
            Permission::create(['name' => $permission]);
        }

        $this->fullUser = $this->createUserWithPermissions(self::PERMISSIONS);
        $this->writeUser = $this->createUserWithPermissions(['read departments', 'write departments']);
        $this->deleteUser = $this->createUserWithPermissions(['read departments', 'delete departments']);
        $this->readUser = $this->createUserWithPermissions(['read departments']);
        $this->commonUser = $this->createUser();

        $creator = ['created_by' => $this->fullUser->id, 'updated_by' => $this->fullUser->id];

        $this->linkedStatus = MachineStatus::forceCreate([
            'name' => 'Vinculado',
            'only_system' => true,
            'tag' => 'linked',
        ]);

        $this->storageStatus = MachineStatus::forceCreate([
            'name' => 'Armazenado',
            'only_system' => true,
            'tag' => 'storage',
        ]);

        $this->manufacturer = Manufacturer::create([...$creator, 'name' => 'Dell']);
        $this->machineCategory = MachineCategory::create([...$creator, 'name' => 'Servidor']);

        $this->department = Department::factory()->create([
            ...$creator,
        ]);
    }

    /**
     * Início dos testes de visualização da listagem de máquinas disponíveis.
     */
    public function test_index_returns_available_machines_as_json(): void
    {
        $this->createMachine(['name' => 'Máquina Livre']);

        $this->actingAs($this->writeUser)
            ->getJson(route('department-machines.index', $this->department))
            ->assertOk()
            ->assertJsonStructure(['machines'])
            ->assertJsonCount(1, 'machines');
    }

    public function test_index_excludes_machines_already_linked(): void
    {
        $free = $this->createMachine(['name' => 'Livre']);
        $linked = $this->createMachine(['name' => 'Vinculada']);

        DepartmentMachine::create([
            'department_id' => $this->department->id,
            'machine_id' => $linked->id,
            'created_by' => $this->fullUser->id,
            'updated_by' => $this->fullUser->id,
        ]);

        $this->actingAs($this->writeUser)
            ->getJson(route('department-machines.index', $this->department))
            ->assertJsonCount(1, 'machines')
            ->assertJsonFragment(['name' => 'Livre'])
            ->assertJsonMissing(['name' => 'Vinculada']);
    }

    public function test_index_filters_by_search(): void
    {
        $this->createMachine(['name' => 'Servidor Dell']);
        $this->createMachine(['name' => 'Workstation HP']);

        $this->actingAs($this->writeUser)
            ->getJson(route('department-machines.index', $this->department).'?search=Dell')
            ->assertJsonCount(1, 'machines')
            ->assertJsonFragment(['name' => 'Servidor Dell']);
    }

    public function test_index_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->getJson(route('department-machines.index', $this->department))
            ->assertForbidden();
    }

    public function test_index_is_forbidden_with_only_read_permission(): void
    {
        $this->actingAs($this->readUser)
            ->getJson(route('department-machines.index', $this->department))
            ->assertForbidden();
    }

    /**
     * Início dos testes de vinculo de máquina ao departamento.
     */
    public function test_store_links_machine_to_department(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->writeUser)
            ->post(route('department-machines.store', $this->department), [
                'machine_id' => $machine->id,
            ])
            ->assertSessionHas('flashMsg.type', 'success');

        $this->assertDatabaseHas('department_has_machines', [
            'department_id' => $this->department->id,
            'machine_id' => $machine->id,
        ]);
    }

    public function test_store_updates_machine_status_to_linked(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->writeUser)
            ->post(route('department-machines.store', $this->department), [
                'machine_id' => $machine->id,
            ]);

        $this->assertDatabaseHas('machines', [
            'id' => $machine->id,
            'status_id' => $this->linkedStatus->id,
        ]);
    }

    public function test_store_fails_validation_without_machine_id(): void
    {
        $this->actingAs($this->writeUser)
            ->post(route('department-machines.store', $this->department), [])
            ->assertSessionHasErrors('machine_id');
    }

    public function test_store_fails_with_nonexistent_machine(): void
    {
        $this->actingAs($this->writeUser)
            ->post(route('department-machines.store', $this->department), [
                'machine_id' => 9999,
            ])
            ->assertSessionHasErrors('machine_id');
    }

    public function test_store_is_forbidden_without_permission(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->readUser)
            ->post(route('department-machines.store', $this->department), [
                'machine_id' => $machine->id,
            ])
            ->assertForbidden();
    }

    public function test_store_is_forbidden_for_common_user(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->commonUser)
            ->post(route('department-machines.store', $this->department), [
                'machine_id' => $machine->id,
            ])
            ->assertForbidden();
    }

    public function test_store_creates_history_trigger_record(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->writeUser)
            ->post(route('department-machines.store', $this->department), [
                'machine_id' => $machine->id,
            ]);

        $this->assertDatabaseHas('xht_departments_machines', [
            'department_id' => $this->department->id,
            'machine_id' => $machine->id,
            'action' => 'attached',
        ]);
    }

    /**
     * Início dos testes de desvinculação de máquina do departamento.
     */
    public function test_destroy_unlinks_machine_from_department(): void
    {
        $machine = $this->createMachine();
        $this->linkMachine($machine);

        $this->actingAs($this->deleteUser)
            ->delete(route('department-machines.destroy', [
                'department' => $this->department->id,
                'machine' => $machine->id,
            ]))
            ->assertSessionHas('flashMsg.type', 'success');

        $this->assertDatabaseMissing('department_has_machines', [
            'department_id' => $this->department->id,
            'machine_id' => $machine->id,
        ]);
    }

    public function test_destroy_restores_machine_status_to_storage(): void
    {
        $machine = $this->createMachine();
        $this->linkMachine($machine);

        $this->actingAs($this->deleteUser)
            ->delete(route('department-machines.destroy', [
                'department' => $this->department->id,
                'machine' => $machine->id,
            ]));

        $this->assertDatabaseHas('machines', [
            'id' => $machine->id,
            'status_id' => $this->storageStatus->id,
        ]);
    }

    public function test_destroy_creates_history_trigger_record(): void
    {
        $machine = $this->createMachine();
        $this->linkMachine($machine);

        $this->actingAs($this->deleteUser)
            ->delete(route('department-machines.destroy', [
                'department' => $this->department->id,
                'machine' => $machine->id,
            ]))
            ->assertSessionHas('flashMsg.type', 'success');

        $this->assertDatabaseHas('xht_departments_machines', [
            'previous_department_id' => $this->department->id,
            'machine_id' => $machine->id,
            'action' => 'detached',
        ]);
    }

    public function test_destroy_is_forbidden_without_permission(): void
    {
        $machine = $this->createMachine();
        $this->linkMachine($machine);

        $this->actingAs($this->readUser)
            ->delete(route('department-machines.destroy', [
                'department' => $this->department->id,
                'machine' => $machine->id,
            ]))
            ->assertForbidden();
    }

    public function test_destroy_returns_404_for_nonexistent_machine(): void
    {
        $this->actingAs($this->deleteUser)
            ->delete(route('department-machines.destroy', [
                'department' => $this->department->id,
                'machine' => 9999,
            ]))
            ->assertNotFound();
    }

    public function test_destroy_returns_error_when_machine_not_linked(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->deleteUser)
            ->delete(route('department-machines.destroy', [
                'department' => $this->department->id,
                'machine' => $machine->id,
            ]))
            ->assertSessionHas('flashMsg.type', 'error');
    }

    /**
     * Início de funções para auxiliar os testes.
     */
    private function creatorFields(): array
    {
        return ['created_by' => $this->fullUser->id, 'updated_by' => $this->fullUser->id];
    }

    private function createMachine(array $overrides = []): Machine
    {
        return Machine::factory()->create(array_merge([
            ...$this->creatorFields(),
            'status_id' => $this->storageStatus->id,
            'manufacturer_id' => $this->manufacturer->id,
            'category_id' => $this->machineCategory->id,
        ], $overrides));
    }

    private function linkMachine(Machine $machine): void
    {
        DepartmentMachine::create([
            'department_id' => $this->department->id,
            'machine_id' => $machine->id,
            ...$this->creatorFields(),
        ]);

        $machine->update(['status_id' => $this->linkedStatus->id]);
    }
}
