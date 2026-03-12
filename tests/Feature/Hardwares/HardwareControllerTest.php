<?php

namespace Tests\Feature\Hardwares;

use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class HardwareControllerTest extends TestCase
{
    use RefreshDatabase;

    private const PERMISSIONS = [
        'read hardwares',
        'write hardwares',
        'delete hardwares',
    ];

    private User $adminUser;

    private User $commonUser;

    private HardwareStatus $status;

    private HardwareCategory $category;

    private Manufacturer $manufacturer;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (self::PERMISSIONS as $permission) {
            Permission::create(['name' => $permission]);
        }

        $this->adminUser = $this->createUserWithPermissions(self::PERMISSIONS);
        $this->commonUser = $this->createUser();

        $creator = [
            'created_by' => $this->adminUser->id,
            'updated_by' => $this->adminUser->id,
        ];

        $this->status = HardwareStatus::create([...$creator, 'name' => 'Ativo']);
        $this->category = HardwareCategory::create([...$creator, 'name' => 'Periférico']);
        $this->manufacturer = Manufacturer::create([...$creator, 'name' => 'Dell']);
    }

    /**
     * Início dos testes de visualização da listagem.
     */
    public function test_index_is_accessible_with_permission(): void
    {
        $this->actingAs($this->adminUser)
            ->get(route('hardwares.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('hardwares/index')
                ->has('listHardwares')
                ->has('pagination')
                ->has('filters')
            );
    }

    public function test_index_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->get(route('hardwares.index'))
            ->assertForbidden();
    }

    public function test_index_filters_by_search(): void
    {
        Hardware::factory()->create([
            ...$this->creatorFields(),
            'name' => 'Monitor Dell',
            'category_id' => $this->category->id,
            'status_id' => $this->status->id,
            'manufacturer_id' => $this->manufacturer->id,
        ]);
        Hardware::factory()->create([
            ...$this->creatorFields(),
            'name' => 'Teclado Logitech',
            'category_id' => $this->category->id,
            'status_id' => $this->status->id,
            'manufacturer_id' => $this->manufacturer->id,
        ]);

        $this->actingAs($this->adminUser)
            ->get(route('hardwares.index', ['search' => 'Monitor']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('listHardwares', 1)
                ->where('listHardwares.0.name', 'Monitor Dell')
            );
    }

    public function test_index_returns_empty_when_no_match(): void
    {
        $this->actingAs($this->adminUser)
            ->get(route('hardwares.index', ['search' => 'xyz-inexistente']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('listHardwares', 0));
    }

    /**
     * Início dos teste de acesso a criação.
     */
    public function test_create_page_is_accessible_with_permission(): void
    {
        $this->actingAs($this->adminUser)
            ->get(route('hardwares.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('hardwares/save')
                ->has('listCategories')
                ->has('listStatus')
                ->has('listManufacturers')
            );
    }

    public function test_create_page_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->get(route('hardwares.create'))
            ->assertForbidden();
    }

    /**
     * Início dos testes de cadastro.
     */
    public function test_store_creates_hardware_successfully(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), $this->validPayload())
            ->assertRedirect(route('hardwares.show', ['hardware' => 3]));

        $this->assertDatabaseHas('hardwares', ['name' => 'Hardware Teste']);
    }

    public function test_store_sets_created_by_and_updated_by(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), $this->validPayload());

        $this->assertDatabaseHas('hardwares', [
            'created_by' => $this->adminUser->id,
            'updated_by' => $this->adminUser->id,
        ]);
    }

    public function test_store_is_forbidden_without_permission(): void
    {
        $this->actingAs($this->commonUser)
            ->post(route('hardwares.store'), $this->validPayload())
            ->assertForbidden();
    }

    public function test_store_fails_with_missing_required_fields(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), [])
            ->assertSessionHasErrors(['name', 'category_id', 'status_id', 'manufacturer_id']);
    }

    public function test_store_fails_with_nonexistent_relations(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), $this->validPayload([
                'category_id' => 999,
                'status_id' => 999,
                'manufacturer_id' => 999,
            ]))
            ->assertSessionHasErrors(['category_id', 'status_id', 'manufacturer_id']);
    }

    public function test_store_fails_with_duplicate_serial_number(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), $this->validPayload(['serial_number' => 'SN-001']));

        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), $this->validPayload([
                'name' => 'Outro Hardware',
                'serial_number' => 'SN-001',
            ]))
            ->assertSessionHasErrors('serial_number');
    }

    public function test_store_fails_with_duplicate_inventory_number(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), $this->validPayload(['inventory_number' => 'INV-001']));

        $this->actingAs($this->adminUser)
            ->post(route('hardwares.store'), $this->validPayload([
                'name' => 'Outro Hardware',
                'inventory_number' => 'INV-001',
            ]))
            ->assertSessionHasErrors('inventory_number');
    }

    /**
     * Início de teste da visualização.
     */
    public function test_show_displays_hardware_with_relations(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->get(route('hardwares.show', $hardware))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('hardwares/show')
                ->has('hardware')
                ->where('hardware.id', $hardware->id)
                ->where('hardware.name', $hardware->name)
                ->has('hardware.category')
                ->has('hardware.status')
                ->has('hardware.manufacturer')
                ->has('hardware.histories')
            );
    }

    public function test_show_is_forbidden_without_permission(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->commonUser)
            ->get(route('hardwares.show', $hardware))
            ->assertForbidden();
    }

    public function test_show_returns_404_for_nonexistent_hardware(): void
    {
        $this->actingAs($this->adminUser)
            ->get(route('hardwares.show', 9999))
            ->assertNotFound();
    }

    /**
     * Início dos testes de acesso a edição.
     */
    public function test_edit_page_loads_hardware_data(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->get(route('hardwares.edit', $hardware))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('hardwares/save')
                ->has('hardware')
                ->where('hardware.id', $hardware->id)
                ->has('listCategories')
                ->has('listStatus')
                ->has('listManufacturers')
            );
    }

    public function test_edit_page_is_forbidden_without_permission(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->commonUser)
            ->get(route('hardwares.edit', $hardware))
            ->assertForbidden();
    }

    /**
     * Início dos testes de edição.
     */
    public function test_update_changes_hardware_data(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->put(route('hardwares.update', $hardware), $this->validPayload(['name' => 'Nome Atualizado']))
            ->assertRedirect(route('hardwares.show', $hardware));

        $this->assertDatabaseHas('hardwares', [
            'id' => $hardware->id,
            'name' => 'Nome Atualizado',
        ]);
    }

    public function test_update_sets_updated_by(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->put(route('hardwares.update', $hardware), $this->validPayload());

        $this->assertDatabaseHas('hardwares', [
            'id' => $hardware->id,
            'updated_by' => $this->adminUser->id,
        ]);
    }

    public function test_update_is_forbidden_without_permission(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->commonUser)
            ->put(route('hardwares.update', $hardware), $this->validPayload())
            ->assertForbidden();
    }

    public function test_update_fails_with_invalid_data(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->put(route('hardwares.update', $hardware), ['name' => ''])
            ->assertSessionHasErrors('name');
    }

    public function test_update_allows_same_serial_number_on_self(): void
    {
        $hardware = $this->createHardware(['serial_number' => 'SN-UNIQUE']);

        $this->actingAs($this->adminUser)
            ->put(route('hardwares.update', $hardware), $this->validPayload([
                'serial_number' => 'SN-UNIQUE',
            ]))
            ->assertRedirect(route('hardwares.show', $hardware));
    }

    /**
     * Início dos testes de desativação.
     */
    public function test_destroy_soft_deletes_hardware(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->adminUser)
            ->delete(route('hardwares.destroy', $hardware))
            ->assertRedirect(route('hardwares.index'))
            ->assertSessionHas('flashMsg', [
                'type' => 'success',
                'message' => "Desativação do Hardware#{$hardware->id} realizada com Sucesso!",
            ]);

        $this->assertSoftDeleted('hardwares', ['id' => $hardware->id]);
    }

    public function test_destroy_is_forbidden_without_permission(): void
    {
        $hardware = $this->createHardware();

        $this->actingAs($this->commonUser)
            ->delete(route('hardwares.destroy', $hardware))
            ->assertForbidden();
    }

    public function test_destroy_returns_404_for_nonexistent_hardware(): void
    {
        $this->actingAs($this->adminUser)
            ->delete(route('hardwares.destroy', 9999))
            ->assertNotFound();
    }

    /**
     * Pequenos testes para validação de permissões parciais.
     */
    public function test_read_only_user_cannot_write(): void
    {
        $readOnlyUser = $this->createUserWithPermissions(['read hardwares']);

        $this->actingAs($readOnlyUser)
            ->get(route('hardwares.index'))
            ->assertOk();

        $this->actingAs($readOnlyUser)
            ->post(route('hardwares.store'), $this->validPayload())
            ->assertForbidden();
    }

    public function test_write_user_cannot_delete(): void
    {
        $writeUser = $this->createUserWithPermissions(['read hardwares', 'write hardwares']);
        $hardware = $this->createHardware();

        $this->actingAs($writeUser)
            ->put(route('hardwares.update', $hardware), $this->validPayload(['name' => 'Nome Atualizado']))
            ->assertRedirect(route('hardwares.show', $hardware));

        $this->actingAs($writeUser)
            ->delete(route('hardwares.destroy', $hardware))
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
            'category_id' => $this->category->id,
            'status_id' => $this->status->id,
            'manufacturer_id' => $this->manufacturer->id,
            'name' => 'Hardware Teste',
            'description' => 'Descrição de teste do hardware.',
            'serial_number' => null,
            'inventory_number' => null,
        ], $overrides);
    }

    private function createHardware(array $overrides = []): Hardware
    {
        return Hardware::factory()->create(array_merge([
            ...$this->creatorFields(),
            'category_id' => $this->category->id,
            'status_id' => $this->status->id,
            'manufacturer_id' => $this->manufacturer->id,
        ], $overrides));
    }
}
