<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    protected $model = \App\Models\Patient::class;
    protected static ?string $tckn;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $tcknRaw = $this->faker->numerify('###########');
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'TCKN' => Hash::make($tcknRaw),
            'tcknRaw' => $tcknRaw, /* Hash durumu kontrol edilecek!!! */
            'phone_number' => fake()->phoneNumber(),
            'gender' => fake()->randomElement(['male', 'female']),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }
}
