<?php

namespace Database\Factories;

use App\Models\Operations;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Operations>
 */
class OperationsFactory extends Factory
{
    protected $model = Operations::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'created_by' => $this->faker->name(),
            'operation' => fake()->unique()->randomElement(['ameliyat', 'diş çekimi', 'dolgu', 'kanal tedavisi', 'Belirlenmedi']),
            'color' => $this->faker->hexColor(),
        ];
    }
}
