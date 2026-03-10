<?php

namespace Database\Factories\Machines;

use App\Models\Machines\MachineStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Machines\Machine>
 */
class MachineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'serial_number' => $this->faker->unique()->bothify('SN-####-??##'),
            'inventory_number' => $this->faker->unique()->bothify('INV-####'),
            'status_id' => MachineStatus::factory(),
            'manufacturer_id' => Manufacturer::factory(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    public function withoutSerial(): static
    {
        return $this->state(['serial_number' => null]);
    }

    public function withoutInventory(): static
    {
        return $this->state(['inventory_number' => null]);
    }
}
