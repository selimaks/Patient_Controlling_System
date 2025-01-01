<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class Appointment extends Controller
{
    public static function index(){
        // Tüm randevuları çekiyoruz
        $appointments = DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.TCKN')
            ->select(
                'appointments.id',
                'appointments.appointment_date',
                'appointments.appointment_time',
                'appointments.doctor_name',
                'appointments.status',
                'appointments.reason',
                'appointments.notes',

                'patients.name as patient_name',
                'patients.phone_number as patient_phone',
            )
            ->get();

        return Inertia::render('Appointments', [
            'appointments' => $appointments,
        ]);
    }
}
