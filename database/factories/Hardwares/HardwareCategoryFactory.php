<?php

namespace Database\Factories\Hardwares;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hardwares\HardwareCategory>
 */
class HardwareCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(2, true),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
