<?php

namespace Tests\Feature\Machines;

use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Machines\Machine;
use App\Models\Machines\MachineCategory;
use App\Models\Machines\MachineHardware;
use App\Models\Machines\MachineStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class MachineControllerTest extends TestCase
{
    use RefreshDatabase;

    private const PERMISSIONS = [
        'read machines',
        'write machines',
        'delete machines',
    ];

    private User $adminUser;

    private User $commonUser;

    private MachineStatus $machineStatus;

    private MachineCategory $machineCategory;

    private Manufacturer $manufacturer;

    private HardwareStatus $hwStatus;

    private HardwareCategory $hwCategory;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (self::PERMISSIONS as $permission) {
            Permission::create(['name' => $permission]);
        }

        Permission::create(['name' => 'read hardwares']);
        Permission::create(['name' => 'write hardwares']);
        Permission::create(['name' => 'delete hardwares']);

        $this->adminUser = $this->createUserWithPermissions(array_merge(
            self::PERMISSIONS,
            ['read hardwares', 'write hardwares', 'delete hardwares']
        ));
        $this->commonUser = $this->createUser();

        $creator = [
            'created_by' => $this->adminUser->id,
            'updated_by' => $this->adminUser->id,
        ];

        HardwareStatus::forceCreate([...$creator, 'name' => 'Vinculado', 'only_system' => true, 'is_binding' => true]);
        HardwareStatus::create([...$creator, 'name' => 'Armazenado']);

        $this->machineStatus = MachineStatus::create([...$creator, 'name' => 'Ativo']);
        $this->machineCategory = MachineCategory::create([...$creator, 'name' => 'Desktop']);
        $this->manufacturer = Manufacturer::create([...$creator, 'name' => 'Dell']);
        $this->hwStatus = HardwareStatus::create([...$creator, 'name' => 'Disponível']);
        $this->hwCategory = HardwareCategory::create([...$creator, 'name' => 'Periférico']);
    }

    /**
     * Início dos testes de visualização da listagem.
     */
    public function test_index_is_accessible_with_permission(): void
    {
        $this->actingAs($this->adminUser)
            ->get(route('machines.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('machines/index')
                ->has('listMachines')
                ->has('pagination', fn (Assert $pagination) => $pagination
                    ->has('currentPage')
                    ->has('lastPage')
                    ->has('perPage')
                    ->has('totalItems')
                )
                ->has('filters')
            );
    }

    public function test_index_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->get(route('machines.index'))
            ->assertForbidden();
    }

    public function test_index_filters_by_search(): void
    {
        $this->createMachine(['name' => 'Servidor Dell']);
        $this->createMachine(['name' => 'Workstation HP']);
        $this->createMachine(['serial_number' => 'SN-FIND-ME']);

        $this->actingAs($this->adminUser)
            ->get(route('machines.index', ['search' => 'Dell']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('listMachines', 1)
                ->where('listMachines.0.name', 'Servidor Dell')
            );

        $this->actingAs($this->adminUser)
            ->get(route('machines.index', ['search' => 'SN-FIND-ME']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('listMachines', 1));
    }

    public function test_index_returns_empty_when_no_match(): void
    {
        $this->createMachine();

        $this->actingAs($this->adminUser)
            ->get(route('machines.index', ['search' => 'xyz-inexistente']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('listMachines', 0));
    }

    /**
     * Início dos teste de acesso a criação.
     */
    public function test_create_page_is_accessible_with_permission(): void
    {
        $this->actingAs($this->adminUser)
            ->get(route('machines.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('machines/save')
                ->has('categories')
                ->has('manufacturers')
                ->has('statuses')
                ->has('hardwares')
                ->has('hw_has_more')
                ->has('hw_total')
            );
    }

    public function test_create_page_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->get(route('machines.create'))
            ->assertForbidden();
    }

    public function test_create_only_shows_free_hardwares(): void
    {
        $this->createHardware();
        $attached = $this->createHardware();

        $machine = $this->createMachine();
        MachineHardware::create([
            'machine_id' => $machine->id,
            'hardware_id' => $attached->id,
            ...$this->creatorFields(),
        ]);

        $this->actingAs($this->adminUser)
            ->get(route('machines.create'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('hw_total', 1)
            );
    }

    /**
     * Início dos testes de cadastro.
     */
    public function test_store_creates_machine_without_hardwares(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload())
            ->assertRedirect(route('machines.show', ['machine' => 23]));

        $this->assertDatabaseHas('machines', ['name' => 'Máquina Teste']);
        $this->assertDatabaseCount('machine_has_hardwares', 0);
    }

    public function test_store_creates_machine_with_hardwares(): void
    {
        $hw1 = $this->createHardware();
        $hw2 = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload([
                'hardware_ids' => [$hw1->id, $hw2->id],
            ]))
            ->assertRedirect(route('machines.show', ['machine' => 24]));

        $this->assertDatabaseCount('machine_has_hardwares', 2);
    }

    public function test_store_sets_created_by_and_updated_by(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload());

        $this->assertDatabaseHas('machines', [
            'created_by' => $this->adminUser->id,
            'updated_by' => $this->adminUser->id,
        ]);
    }

    public function test_store_with_notes_fills_machine_hardware_history(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload([
                'hardware_ids' => [$hardware->id],
                'notes' => 'Vinculado para uso no setor de TI.',
            ]));

        $this->assertDatabaseHas('xht_machines_hardwares', [
            'hardware_id' => $hardware->id,
            'action' => 'attached',
            'notes' => 'Vinculado para uso no setor de TI.',
        ]);
    }

    public function test_update_link_with_notes(): void
    {
        $machine = $this->createMachine();
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload([
                'hardware_ids' => [$hardware->id],
                'notes' => 'Realocado após manutenção.',
            ]));

        $this->assertDatabaseHas('xht_machines_hardwares', [
            'machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
            'notes' => 'Realocado após manutenção.',
        ]);
    }

    public function test_update_unlink_with_notes(): void
    {
        $machine = $this->createMachine();
        $hardware = $this->createHardware();

        MachineHardware::create([
            'machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
            ...$this->creatorFields(),
        ]);

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload([
                'hardware_ids' => [],
                'notes' => 'Hardware devolvido ao estoque para reparos.',
            ]));

        $this->assertDatabaseHas('xht_machines_hardwares', [
            'previous_machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
            'notes' => 'Hardware devolvido ao estoque para reparos.',
        ]);
    }

    public function test_without_notes_saves_null_in_both_histories(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload([
                'hardware_ids' => [$hardware->id],
            ]));

        $this->assertDatabaseHas('xht_machines_hardwares', [
            'hardware_id' => $hardware->id,
            'notes' => null,
        ]);
    }

    public function test_link_hardware_changes_status_to_linked(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload([
                'hardware_ids' => [$hardware->id],
            ]));

        $linkedStatus = HardwareStatus::linkedStatus()->first();
        $this->assertDatabaseHas('hardwares', [
            'id' => $hardware->id,
            'status_id' => $linkedStatus->id,
        ]);
    }

    public function test_unlink_with_notes_fills_both_histories(): void
    {
        $machine = $this->createMachine();
        $hardware = $this->createHardware();

        MachineHardware::create([
            'machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
            ...$this->creatorFields(),
        ]);

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload([
                'hardware_ids' => [],
                'notes' => 'Removido para manutenção.',
            ]));

        $this->assertDatabaseHas('xht_machines_hardwares', [
            'hardware_id' => $hardware->id,
            'action' => 'detached',
            'notes' => 'Removido para manutenção.',
        ]);
    }

    public function test_store_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->post(route('machines.store'), $this->validPayload())
            ->assertForbidden();
    }

    public function test_store_fails_with_missing_required_fields(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), [])
            ->assertSessionHasErrors(['name', 'category_id', 'manufacturer_id', 'status_id']);
    }

    public function test_store_fails_with_duplicate_serial_number(): void
    {
        $this->createMachine(['serial_number' => 'SN-DUP']);

        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload(['serial_number' => 'SN-DUP']))
            ->assertSessionHasErrors('serial_number');
    }

    public function test_store_fails_with_duplicate_inventory_number(): void
    {
        $this->createMachine(['inventory_number' => 'INV-DUP']);

        $this->actingAs($this->adminUser)
            ->post(route('machines.store'), $this->validPayload(['inventory_number' => 'INV-DUP']))
            ->assertSessionHasErrors('inventory_number');
    }

    /**
     * Início de teste da visualização.
     */
    public function test_show_renders_machine_with_relations(): void
    {
        $machine = $this->createMachine();
        $hardware = $this->createHardware();

        MachineHardware::create([
            'machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
            ...$this->creatorFields(),
        ]);

        $this->actingAs($this->adminUser)
            ->get(route('machines.show', $machine))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('machines/show')
                ->has('machine')
                ->where('machine.id', $machine->id)
                ->has('machine.machine_hardwares', 1)
                ->has('machine.category')
                ->has('machine.manufacturer')
                ->has('machine.status')
                ->has('machine.hardware_histories')
            );
    }

    public function test_show_is_forbidden_without_permission(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->commonUser)
            ->get(route('machines.show', $machine))
            ->assertForbidden();
    }

    public function test_show_returns_404_for_nonexistent_machine(): void
    {
        $this->actingAs($this->adminUser)
            ->get(route('machines.show', 9999))
            ->assertNotFound();
    }

    /**
     * Início dos testes de acesso a edição.
     */
    public function test_edit_page_loads_machine_data(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->adminUser)
            ->get(route('machines.edit', $machine))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('machines/save')
                ->has('machine')
                ->where('machine.id', $machine->id)
                ->has('categories')
                ->has('manufacturers')
                ->has('statuses')
                ->has('hardwares')
            );
    }

    public function test_edit_shows_own_hardwares_and_free_hardwares(): void
    {
        $machine = $this->createMachine();
        $ownHardware = $this->createHardware();
        $freeHardware = $this->createHardware();
        $otherHardware = $this->createHardware();

        MachineHardware::create([
            'machine_id' => $machine->id,
            'hardware_id' => $ownHardware->id,
            ...$this->creatorFields(),
        ]);

        $otherMachine = $this->createMachine();
        MachineHardware::create([
            'machine_id' => $otherMachine->id,
            'hardware_id' => $otherHardware->id,
            ...$this->creatorFields(),
        ]);

        $this->actingAs($this->adminUser)
            ->get(route('machines.edit', $machine))
            ->assertInertia(fn (Assert $page) => $page
                ->where('hw_total', 2)
            );
    }

    public function test_edit_is_forbidden_without_permission(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->commonUser)
            ->get(route('machines.edit', $machine))
            ->assertForbidden();
    }

    /**
     * Início dos testes de edição.
     */
    public function test_update_changes_machine_data(): void
    {
        $machine = $this->createMachine(['name' => 'Nome Antigo']);

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload(['name' => 'Nome Novo']))
            ->assertRedirect(route('machines.show', $machine));

        $this->assertDatabaseHas('machines', ['id' => $machine->id, 'name' => 'Nome Novo']);
    }

    public function test_update_attaches_new_hardwares(): void
    {
        $machine = $this->createMachine();
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload([
                'hardware_ids' => [$hardware->id],
            ]));

        $this->assertDatabaseHas('machine_has_hardwares', [
            'machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
        ]);
    }

    public function test_update_detaches_removed_hardwares(): void
    {
        $machine = $this->createMachine();
        $hardware = $this->createHardware();

        MachineHardware::create([
            'machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
            ...$this->creatorFields(),
        ]);

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload(['hardware_ids' => []]));

        $this->assertDatabaseMissing('machine_has_hardwares', [
            'machine_id' => $machine->id,
            'hardware_id' => $hardware->id,
        ]);
    }

    public function test_update_sets_updated_by(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload());

        $this->assertDatabaseHas('machines', [
            'id' => $machine->id,
            'updated_by' => $this->adminUser->id,
        ]);
    }

    public function test_update_is_forbidden_without_permission(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->commonUser)
            ->put(route('machines.update', $machine), $this->validPayload())
            ->assertForbidden();
    }

    public function test_update_allows_same_serial_number_on_self(): void
    {
        $machine = $this->createMachine(['serial_number' => 'SN-SAME']);

        $this->actingAs($this->adminUser)
            ->put(route('machines.update', $machine), $this->validPayload([
                'serial_number' => 'SN-SAME',
            ]))
            ->assertRedirect(route('machines.show', $machine));
    }

    /**
     * Início dos testes de desativação.
     */
    public function test_destroy_soft_deletes_machine(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->adminUser)
            ->delete(route('machines.destroy', $machine))
            ->assertRedirect(route('machines.index'))
            ->assertSessionHas('flashMsg', [
                'type' => 'success',
                'message' => "Desativação da Máquina#{$machine->id} realizada com Sucesso!",
            ]);

        $this->assertSoftDeleted('machines', ['id' => $machine->id]);
    }

    public function test_destroy_is_forbidden_without_permission(): void
    {
        $machine = $this->createMachine();

        $this->actingAs($this->commonUser)
            ->delete(route('machines.destroy', $machine))
            ->assertForbidden();
    }

    public function test_destroy_returns_404_for_nonexistent_machine(): void
    {
        $this->actingAs($this->adminUser)
            ->delete(route('machines.destroy', 9999))
            ->assertNotFound();
    }

    /**
     * Pequenos testes para validação de permissões parciais.
     */
    public function test_read_only_user_cannot_write(): void
    {
        $readOnly = $this->createUserWithPermissions(['read machines']);

        $this->actingAs($readOnly)
            ->get(route('machines.index'))
            ->assertOk();

        $this->actingAs($readOnly)
            ->post(route('machines.store'), $this->validPayload())
            ->assertForbidden();
    }

    public function test_write_user_cannot_delete(): void
    {
        $writeUser = $this->createUserWithPermissions(['read machines', 'write machines']);
        $machine = $this->createMachine();

        $this->actingAs($writeUser)
            ->put(route('machines.update', $machine), $this->validPayload(['name' => 'Nome Novo']))
            ->assertRedirect(route('machines.show', $machine));

        $this->actingAs($writeUser)
            ->delete(route('machines.destroy', $machine))
            ->assertForbidden();
    }

    /**
     * Início de funções para auxiliar os testes.
     */
    private function creatorFields(): array
    {
        return [
            'created_by' => $this->adminUser->id,
            'updated_by' => $this->adminUser->id,
        ];
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Máquina Teste',
            'serial_number' => null,
            'inventory_number' => null,
            'category_id' => $this->machineCategory->id,
            'manufacturer_id' => $this->manufacturer->id,
            'status_id' => $this->machineStatus->id,
            'hardware_ids' => [],
        ], $overrides);
    }

    private function createMachine(array $overrides = []): Machine
    {
        return Machine::factory()->create(array_merge([
            ...$this->creatorFields(),
            'category_id' => $this->machineCategory->id,
            'manufacturer_id' => $this->manufacturer->id,
            'status_id' => $this->machineStatus->id,
        ], $overrides));
    }

    private function createHardware(array $overrides = []): Hardware
    {
        return Hardware::factory()->create(array_merge([
            ...$this->creatorFields(),
            'category_id' => $this->hwCategory->id,
            'status_id' => $this->hwStatus->id,
            'manufacturer_id' => $this->manufacturer->id,
        ], $overrides));
    }
}
