<?php

namespace Database\Factories\Machines;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Machines\MachineStatus>
 */
class MachineStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
