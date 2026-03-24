<?php

namespace App\Jobs\Machines;

use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Machines\Machine;
use App\Models\Machines\MachineHardware;
use App\Models\Machines\MachineStatus;
use App\Services\LogService;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class CloneMachineJob implements ShouldQueue
{
    use Batchable, Queueable;

    public int $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private readonly int $sourceMachineId,
        private readonly int $createdById
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        $source = Machine::with(['machineHardwares.hardware', 'category', 'manufacturer'])->find($this->sourceMachineId);
        if (! $source) {
            return;
        }

        $creator = ['created_by' => $this->createdById, 'updated_by' => $this->createdById];
        $machineStorage = MachineStatus::storageStatus()->first();
        $hwLinkStatus = HardwareStatus::linkedStatus()->first();
        DB::transaction(function () use ($source, $creator, $hwLinkStatus, $machineStorage) {
            $machineMirror = Machine::create([
                'name' => $source->name,
                'serial_number' => null,
                'inventory_number' => null,
                'manufacturer_id' => $source->manufacturer_id,
                'status_id' => $machineStorage->id,
                'category_id' => $source->category_id,
                ...$creator,
            ]);

            foreach ($source->machineHardwares as $mh) {
                $hw = $mh->hardware;
                $hwMirror = Hardware::create([
                    'name' => $hw->name,
                    'serial_number' => null,
                    'inventory_number' => null,
                    'category_id' => $hw->category_id,
                    'manufacturer_id' => $hw->manufacturer_id,
                    'status_id' => $hwLinkStatus->id,
                    'description' => $hw->description,
                    ...$creator,
                ]);

                MachineHardware::create([
                    'machine_id' => $machineMirror->id,
                    'hardware_id' => $hwMirror->id,
                    ...$creator,
                ]);
            }
        });
    }

    public function failed(\Throwable $e): void
    {
        LogService::error("CloneMachineJob falhou para source #{$this->sourceMachineId}! ERROR: {$e->getMessage()}");
    }
}
