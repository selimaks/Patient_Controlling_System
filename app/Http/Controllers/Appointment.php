<?php

namespace App\Http\Controllers;

use App\Models\Appointment as AppointmentModel;
use Illuminate\Http\Request;
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
                'appointments.operation',
                'appointments.notes',

                'patients.name as patient_name',
                'patients.phone_number as patient_phone',
            )
            ->get();

        return Inertia::render('Appointments', [
            'appointments' => $appointments,
        ]);
    }
    public static function create(Request $request){
        {/*
            $validatedData = $request->validate([
                'patient_id' => 'required|string|max:11',
                'appointment_date' => 'required|date_format:Y-m-d',
                'appointment_time' => 'required|date_format:H:i',
                'doctor_name' => 'required|string|max:255',
                'operation' => 'required|string|max:255',
                'notes' => 'required|string|max:255',
                'created_at' => now(),
                'created_by' => 'required|string|max:255',
                'status' => 'required|string|max:25',
            ]);
        */}

        try {
            $validatedData = $request->validate([
                'patient_id' => 'required|string|max:11',
                'appointment_date' => 'required|date_format:Y-m-d',
                'appointment_time' => 'required|date_format:H:i:s',
                'doctor_name' => 'required|string|max:255',
                'operation' => 'required|string|max:255',
                'notes' => 'nullable|string|max:255',
                'status' => 'required|string|max:25',
                'created_by' => 'required|string|max:255',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            dd($e->errors()); // Tüm validation hatalarını inceleyin
        }

        AppointmentModel::updateOrInsert(
            ['patient_id' => $validatedData['patient_id']],
            array_merge(
                [
                    'appointment_date' => $validatedData['appointment_date'],
                    'appointment_time' => $validatedData['appointment_time'],
                    'doctor_name' => $validatedData['doctor_name'],
                    'operation' => $validatedData['operation'],
                    'notes' => $validatedData['notes'],
                    'created_by' => $validatedData['created_by'],
                    'updated_at' => now(),
                ],
                DB::table('appointments')->where([
                    'patient_id' => $validatedData['patient_id'],
                ])->exists()
                ? []
                : ['created_at' => now()]
            )
        );
        return redirect()->back()->with('message', 'Randevu kaydı yapıldı.');
    }
}
