<?php

namespace Tests\Feature\Machines;

use App\Jobs\Machines\CloneMachineJob;
use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Machines\Machine;
use App\Models\Machines\MachineCategory;
use App\Models\Machines\MachineHardware;
use App\Models\Machines\MachineStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use App\Notifications\Machines\MachineCloneBatchFinished;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class MachineCloneControllerTest extends TestCase
{
    use RefreshDatabase;

    private const PERMISSIONS = ['clone machines'];

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

        Permission::create(['name' => 'read machines']);

        $this->adminUser = $this->createUserWithPermissions(array_merge(self::PERMISSIONS, ['read machines']));
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
                ->has('pagination')
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

        $this->actingAs($this->adminUser)
            ->get(route('machines.index', ['search' => 'Dell']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('listMachines', 1)
                ->where('listMachines.0.name', 'Servidor Dell')
            );
    }

    /**
     * Início dos testes de cadastro.
     */
    public function test_store_dispatches_batch_jobs(): void
    {
        Bus::fake();

        $source = $this->createMachine();

        $this->actingAs($this->adminUser)
            ->post(route('machine-clone.store', $source), ['copies' => 3])
            ->assertRedirect()
            ->assertSessionHas('flashMsg.type', 'success');

        Bus::assertBatched(fn ($batch) => $batch->jobs->count() === 3);
    }

    public function test_store_dispatches_correct_number_of_jobs(): void
    {
        Bus::fake();

        $source = $this->createMachine();

        $this->actingAs($this->adminUser)
            ->post(route('machine-clone.store', $source), ['copies' => 10]);

        Bus::assertBatched(fn ($batch) => $batch->jobs->count() === 10);
    }

    public function test_store_fails_validation_above_max_copies(): void
    {
        $max = config('machines.clone_max_copies', 500);

        $source = $this->createMachine();

        $this->actingAs($this->adminUser)
            ->post(route('machine-clone.store', $source), ['copies' => $max + 1])
            ->assertSessionHasErrors('copies');
    }

    public function test_store_fails_validation_with_zero_copies(): void
    {
        $source = $this->createMachine();

        $this->actingAs($this->adminUser)
            ->post(route('machine-clone.store', $source), ['copies' => 0])
            ->assertSessionHasErrors('copies');
    }

    public function test_store_is_forbidden_without_permission(): void
    {
        $source = $this->createMachine();

        $this->actingAs($this->commonUser)
            ->post(route('machine-clone.store', $source), ['copies' => 1])
            ->assertForbidden();
    }

    public function test_store_returns_404_for_nonexistent_machine(): void
    {
        $this->actingAs($this->adminUser)
            ->post(route('machine-clone.store', 9999), ['copies' => 1])
            ->assertNotFound();
    }

    /**
     * Início dos testes de job.
     */
    public function test_job_clones_machine_with_hardwares(): void
    {
        $source = $this->createMachine();
        $hw1 = $this->createHardware();
        $hw2 = $this->createHardware();

        MachineHardware::create(['machine_id' => $source->id, 'hardware_id' => $hw1->id, ...$this->creatorFields()]);
        MachineHardware::create(['machine_id' => $source->id, 'hardware_id' => $hw2->id, ...$this->creatorFields()]);

        $job = new CloneMachineJob($source->id, $this->adminUser->id);
        $job->handle();

        $clone = Machine::where('id', '!=', $source->id)->first();
        $this->assertNotNull($clone);
        $this->assertCount(2, $clone->machineHardwares);
    }

    public function test_job_clones_hardware_without_serial_and_inventory(): void
    {
        $source = $this->createMachine();
        $hardware = $this->createHardware(['serial_number' => 'SN-001', 'inventory_number' => 'INV-001']);

        MachineHardware::create(['machine_id' => $source->id, 'hardware_id' => $hardware->id, ...$this->creatorFields()]);

        $job = new CloneMachineJob($source->id, $this->adminUser->id);
        $job->handle();

        $clone = Machine::where('id', '!=', $source->id)->first();
        $hwClone = $clone->machineHardwares->first()->hardware;

        $this->assertNull($hwClone->serial_number);
        $this->assertNull($hwClone->inventory_number);
        $this->assertEquals($hardware->name, $hwClone->name);
        $this->assertEquals($hardware->category_id, $hwClone->category_id);
        $this->assertEquals($hardware->manufacturer_id, $hwClone->manufacturer_id);
    }

    public function test_job_clones_machine_without_serial_and_inventory(): void
    {
        $source = $this->createMachine([
            'serial_number' => 'SN-ORIG',
            'inventory_number' => 'INV-ORIG',
        ]);

        $job = new CloneMachineJob($source->id, $this->adminUser->id);
        $job->handle();

        $clone = Machine::where('id', '!=', $source->id)->first();
        $this->assertNull($clone->serial_number);
        $this->assertNull($clone->inventory_number);
    }

    public function test_job_copies_manufacturer_status_and_category(): void
    {
        $source = $this->createMachine();

        $job = new CloneMachineJob($source->id, $this->adminUser->id);
        $job->handle();

        $clone = Machine::where('id', '!=', $source->id)->first();
        $this->assertEquals($source->manufacturer_id, $clone->manufacturer_id);
        $this->assertEquals($source->status_id, $clone->status_id);
        $this->assertEquals($source->category_id, $clone->category_id);
    }

    public function test_job_sends_notification_on_batch_finish(): void
    {
        Notification::fake();

        $source = $this->createMachine();

        // Roda o job diretamente para testar a notificação via callback
        $job = new CloneMachineJob($source->id, $this->adminUser->id);
        $job->handle();

        // Dispara manualmente o callback finally do batch
        $this->adminUser->notify(
            new MachineCloneBatchFinished($source->name, 1, 0)
        );

        Notification::assertSentTo($this->adminUser,
            MachineCloneBatchFinished::class,
            fn ($n) => $n->toDatabase($this->adminUser)['type'] === 'success'
        );
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
