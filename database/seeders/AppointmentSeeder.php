<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Örneğin 100 tane random appointment (randevu) oluşturulur.
        Appointment::factory(10)->create();
    }
}
