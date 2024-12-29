<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Message;
class MessageFactory extends Factory
{
    protected $model =
    Message::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $receiver_id = '100001';
        $sender_id = '100000';
        return [

            'message' => $this->faker->text(200),
            'conversation_id' => $this->faker->numerify('##########'),
            'patient_id' => $sender_id,
            'doctor_id' => $receiver_id,
            'message_type' => $this->faker->randomElement(['text', 'image', 'video']),
            'message_deleted_status' => '0',
        ];
    }
}
