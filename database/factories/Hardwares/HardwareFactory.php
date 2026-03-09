<?php

namespace Database\Factories\Hardwares;

use App\Models\Hardwares\HardwareCategory;
use App\Models\Hardwares\HardwareStatus;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hardwares\Hardware>
 */
class HardwareFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'serial_number' => $this->faker->unique()->bothify('SN-####-??##'),
            'inventory_number' => $this->faker->unique()->bothify('INV-####'),
            'category_id' => HardwareCategory::factory(),
            'status_id' => HardwareStatus::factory(),
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
