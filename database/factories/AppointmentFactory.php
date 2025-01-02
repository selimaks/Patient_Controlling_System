<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Appointment;
use App\Models\Patient;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::inRandomOrder()->first()?->id ?? Patient::factory(),
            'doctor_name' => $this->faker->name(),
            'created_by' => $this->faker->randomElement(['doctor', 'assistant', 'worker']),
            'appointment_date' => $this->faker->dateTimeBetween('now', '+10 days'),
            'appointment_time' => $this->faker->time(),
            'status' => $this->faker->randomElement(['scheduled', 'completed', 'canceled']),
            'operation' => $this->faker->randomElement(['surgery', 'operation','not_specified' , 'other']),
            'notes' => $this->faker->optional()->text(200),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
