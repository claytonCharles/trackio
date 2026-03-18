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
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class DepartmentControllerTest extends TestCase
{
    use RefreshDatabase;

    private const PERMISSIONS = [
        'read departments',
        'write departments',
        'delete departments',
    ];

    private User $fullUser;

    private User $readUser;

    private User $writeUser;

    private User $deleteUser;

    private User $commonUser;

    private MachineStatus $machineStatus;

    private Manufacturer $manufacturer;

    private MachineCategory $machineCategory;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (self::PERMISSIONS as $permission) {
            Permission::create(['name' => $permission]);
        }

        $this->fullUser = $this->createUserWithPermissions(self::PERMISSIONS);
        $this->readUser = $this->createUserWithPermissions(['read departments']);
        $this->writeUser = $this->createUserWithPermissions(['read departments', 'write departments']);
        $this->deleteUser = $this->createUserWithPermissions(['read departments', 'delete departments']);
        $this->commonUser = $this->createUser();

        $creator = ['created_by' => $this->fullUser->id, 'updated_by' => $this->fullUser->id];

        MachineStatus::forceCreate(['name' => 'Vinculado', 'only_system' => true, 'tag' => 'linked']);

        $this->manufacturer = Manufacturer::create([...$creator, 'name' => 'Dell']);
        $this->machineCategory = MachineCategory::create([...$creator, 'name' => 'Servidor']);
        $this->machineStatus = MachineStatus::forceCreate([
            'name' => 'Armazenado',
            'only_system' => true,
            'tag' => 'storage',
        ]);

    }

    /**
     * Início dos testes de visualização da listagem.
     */
    public function test_index_is_accessible_with_read_permission(): void
    {
        $this->actingAs($this->readUser)
            ->get(route('departments.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('departments/index')
                ->has('listDepartments')
                ->has('pagination')
                ->has('filters')
            );
    }

    public function test_index_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->get(route('departments.index'))
            ->assertForbidden();
    }

    public function test_index_returns_paginated_departments(): void
    {
        $this->createDepartment(['name' => 'TI']);
        $this->createDepartment(['name' => 'RH']);

        $this->actingAs($this->readUser)
            ->get(route('departments.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('listDepartments', 2)
                ->where('pagination.totalItems', 2)
            );
    }

    public function test_index_filters_by_search(): void
    {
        $this->createDepartment(['name' => 'Tecnologia da Informação']);
        $this->createDepartment(['name' => 'Recursos Humanos']);

        $this->actingAs($this->readUser)
            ->get(route('departments.index', ['search' => 'Tecnologia']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('listDepartments', 1)
                ->where('listDepartments.0.name', 'Tecnologia da Informação')
            );
    }

    public function test_index_returns_empty_when_no_match(): void
    {
        $this->createDepartment(['name' => 'TI']);

        $this->actingAs($this->readUser)
            ->get(route('departments.index', ['search' => 'xyz']))
            ->assertInertia(fn (Assert $page) => $page->has('listDepartments', 0));
    }

    public function test_index_returns_filters_in_props(): void
    {
        $this->actingAs($this->readUser)
            ->get(route('departments.index', ['search' => 'TI']))
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.search', 'TI')
            );
    }

    /**
     * Início dos testes de cadastro.
     */
    public function test_store_creates_department_with_valid_data(): void
    {
        $this->actingAs($this->writeUser)
            ->post(route('departments.store'), $this->validDepartmentPayload())
            ->assertRedirect();

        $this->assertDatabaseHas('departments', ['name' => 'Departamento Teste']);
    }

    public function test_store_redirects_to_show_on_success(): void
    {
        $this->actingAs($this->writeUser)
            ->post(route('departments.store'), $this->validDepartmentPayload())
            ->assertSessionHas('flashMsg.type', 'success');

        $dept = Department::first();
        $this->assertNotNull($dept);
    }

    public function test_store_sets_created_by(): void
    {
        $this->actingAs($this->writeUser)
            ->post(route('departments.store'), $this->validDepartmentPayload());

        $this->assertDatabaseHas('departments', [
            'name' => 'Departamento Teste',
            'created_by' => $this->writeUser->id,
        ]);
    }

    public function test_store_fails_validation_without_name(): void
    {
        $payload = $this->validDepartmentPayload();
        unset($payload['name']);

        $this->actingAs($this->writeUser)
            ->post(route('departments.store'), $payload)
            ->assertSessionHasErrors('name');
    }

    public function test_store_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->readUser)
            ->post(route('departments.store'), $this->validDepartmentPayload())
            ->assertForbidden();
    }

    public function test_store_optional_fields_are_nullable(): void
    {
        $payload = [
            'name' => 'Departamento Sem Extras',
            'description' => null,
            'location' => null,
        ];

        $this->actingAs($this->writeUser)
            ->post(route('departments.store'), $payload)
            ->assertSessionHas('flashMsg.type', 'success');

        $this->assertDatabaseHas('departments', ['name' => 'Departamento Sem Extras']);
    }

    /**
     * Início de teste da visualização.
     */
    public function test_show_is_accessible_with_read_permission(): void
    {
        $dept = $this->createDepartment();

        $this->actingAs($this->readUser)
            ->get(route('departments.show', $dept))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('departments/show')
                ->has('department')
                ->where('department.id', $dept->id)
            );
    }

    public function test_show_is_forbidden_without_permission(): void
    {
        $dept = $this->createDepartment();

        $this->actingAs($this->commonUser)
            ->get(route('departments.show', $dept))
            ->assertForbidden();
    }

    public function test_show_loads_relations(): void
    {
        $dept = $this->createDepartment();

        $this->actingAs($this->readUser)
            ->get(route('departments.show', $dept))
            ->assertInertia(fn (Assert $page) => $page
                ->has('department.created_by')
                ->has('department.updated_by')
                ->has('department.department_machines')
                ->has('department.histories')
            );
    }

    public function test_show_returns_404_for_nonexistent_department(): void
    {
        $this->actingAs($this->readUser)
            ->get(route('departments.show', 9999))
            ->assertNotFound();
    }

    /**
     * Início dos testes de edição.
     */
    public function test_update_modifies_department_with_valid_data(): void
    {
        $dept = $this->createDepartment(['name' => 'Antigo']);
        $newData = array_merge(
            $this->validDepartmentPayload(),
            ['name' => 'Novo Nome']
        );

        $this->actingAs($this->writeUser)
            ->put(route('departments.update', $dept), $newData)
            ->assertSessionHas('flashMsg.type', 'success');

        $this->assertDatabaseHas('departments', ['id' => $dept->id, 'name' => 'Novo Nome']);
    }

    public function test_update_sets_updated_by(): void
    {
        $dept = $this->createDepartment();

        $this->actingAs($this->writeUser)
            ->put(route('departments.update', $dept), $this->validDepartmentPayload());

        $this->assertDatabaseHas('departments', [
            'id' => $dept->id,
            'updated_by' => $this->writeUser->id,
        ]);
    }

    public function test_update_fails_validation_without_name(): void
    {
        $dept = $this->createDepartment();
        $payload = $this->validDepartmentPayload();
        unset($payload['name']);

        $this->actingAs($this->writeUser)
            ->put(route('departments.update', $dept), $payload)
            ->assertSessionHasErrors('name');
    }

    public function test_update_is_forbidden_without_permission(): void
    {
        $dept = $this->createDepartment();

        $this->actingAs($this->readUser)
            ->put(route('departments.update', $dept), $this->validDepartmentPayload())
            ->assertForbidden();
    }

    public function test_update_returns_404_for_nonexistent_department(): void
    {
        $this->actingAs($this->writeUser)
            ->put(route('departments.update', 9999), $this->validDepartmentPayload())
            ->assertNotFound();
    }

    /**
     * Início dos testes de desativação.
     */
    public function test_destroy_deactivates_department_without_machines(): void
    {
        $dept = $this->createDepartment();

        $this->actingAs($this->deleteUser)
            ->delete(route('departments.destroy', $dept))
            ->assertRedirect(route('departments.index'))
            ->assertSessionHas('flashMsg.type', 'success');

        $this->assertSoftDeleted('departments', ['id' => $dept->id]);
    }

    public function test_destroy_is_blocked_when_department_has_machines(): void
    {
        $dept = $this->createDepartment();
        $machine = $this->createMachine();

        DepartmentMachine::create([
            'department_id' => $dept->id,
            'machine_id' => $machine->id,
            'created_by' => $this->fullUser->id,
            'updated_by' => $this->fullUser->id,
        ]);

        $this->actingAs($this->deleteUser)
            ->delete(route('departments.destroy', $dept))
            ->assertSessionHas('flashMsg.type', 'error');

        $this->assertNotSoftDeleted('departments', ['id' => $dept->id]);
    }

    public function test_destroy_is_forbidden_without_permission(): void
    {
        $dept = $this->createDepartment();

        $this->actingAs($this->readUser)
            ->delete(route('departments.destroy', $dept))
            ->assertForbidden();
    }

    public function test_destroy_returns_404_for_nonexistent_department(): void
    {
        $this->actingAs($this->deleteUser)
            ->delete(route('departments.destroy', 9999))
            ->assertNotFound();
    }

    /**
     * Início de funções para auxiliar os testes.
     */
    private function creatorFields(): array
    {
        return ['created_by' => $this->fullUser->id, 'updated_by' => $this->fullUser->id];
    }

    private function validDepartmentPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Departamento Teste',
            'description' => 'Descrição do departamento',
            'location' => 'Bloco A, 2º andar',
        ], $overrides);
    }

    private function createDepartment(array $overrides = []): Department
    {
        return Department::factory()->create(array_merge([
            ...$this->creatorFields(),
        ], $overrides));
    }

    private function createMachine(array $overrides = []): Machine
    {
        return Machine::factory()->create(array_merge([
            ...$this->creatorFields(),
            'status_id' => $this->machineStatus->id,
            'manufacturer_id' => $this->manufacturer->id,
            'category_id' => $this->machineCategory->id,
        ], $overrides));
    }
}
