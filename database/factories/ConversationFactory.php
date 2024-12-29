<?php

namespace Database\Factories;

use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => $this->faker->numerify('##########'),
            'patient_id' => $this->faker->numerify('##########'),
            'doctor_id' => $this->faker->numerify('##########'),
            'created_by' => $this->faker->randomElement(['doctor/assistant', 'patient']),
            'can_be_seen_by' => $this->faker->randomElement(['doctor,assistant', 'doctor', 'all']),
        ];
    }
}
