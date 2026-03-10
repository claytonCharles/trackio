<?php

namespace Database\Factories\Machines;

use App\Models\Hardwares\Hardware;
use App\Models\Machines\Machine;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Machines\MachineHardware>
 */
class MachineHardwareFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'machine_id' => Machine::factory(),
            'hardware_id' => Hardware::factory(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
