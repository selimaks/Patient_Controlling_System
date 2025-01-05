<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Dashboard extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today();

        return inertia('Dashboard', [
            'totalPatients' => Patient::count(),
            'todaysPatients' => Patient::whereDate('created_at', $today)->count(),
            'todaysAppointments' => Appointment::whereDate('appointment_date', $today)->count(),
            'completedAppointmentsToday' => Appointment::where('status', 'completed')->whereDate('appointment_date', $today)->count(),
            'totalAppointments' => Appointment::where('status', 'scheduled')->count(),
            'totalDoctors' => User::where('job', 'doctor')->count(),
            'todaysSchedules' => Appointment::join('patients', 'patient_id', '=', 'patients.TCKN')
                ->select('patients.TCKN', 'patients.name', 'appointments.id', 'appointments.appointment_date', 'appointments.appointment_time', 'appointments.doctor_name', 'appointments.status', 'appointments.operation') // İlişkiyi yükle
            ->whereDate('appointment_date', $today)
                ->where('status', 'scheduled')
                ->get(),
            'newPatients' => Patient::whereDate('created_at', $today)->get(),
        ]);
    }

    public function completed(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['status' => 'completed']);
        return redirect()->back()->with('message', 'Randevu tamamlandı');
    }
    public function canceled(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['status' => 'canceled']);
        return redirect()->back()->with('message', 'Randevu iptal edildi');
    }
}
