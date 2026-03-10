<?php

namespace Database\Factories\Hardwares;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hardwares\HardwareStatus>
 */
class HardwareStatusFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'only_system' => false,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    public function onlySystem(): static
    {
        return $this->state(['only_system' => true]);
    }
}
