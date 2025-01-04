<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PatientController extends Controller
{
    public function index()
    {
        $patients = DB::table('patients')->orderBy('name')->where("isDeleted", "0")->get();
        $doctors = DB::table('users')->where('job', 'doctor')->select('name')->get();
        return inertia('Patients', ['patients' => $patients,
            'doctors' => $doctors]);
    }
    public function getAppointmentsRecord(Request $request)
    {
        $appointments = DB::table('appointments')->where('patient_id',$request['TCKN'])->orderBy('appointment_date')->get();
        return response()->json([
            'appointments' => $appointments,
        ]);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        if (!$patient) {
            throw ValidationException::withMessages([
                'error' => 'Hasta bulunamadı!'
            ]);
        }
        $patient->update($request->only(['TCKN', 'name', 'email', 'phone_number', 'doctor', 'gender']));
        return redirect()->back()->with('message', 'Hasta başarıyla güncellendi.');
    }
    public function delete(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        if (!$patient) {
            throw ValidationException::withMessages([
                'error' => 'Hasta bulunamadı!'
            ]);
        }

        if ($patient->isDeleted) {
            throw ValidationException::withMessages([
                'error' => 'Bu hasta zaten silinmiş!'
            ]);
        }
        $patient->update(['isDeleted' => "1"]);

        return redirect()->back()->with('message', 'Hasta başarıyla silindi.');
    }

    /**
     * @throws ValidationException
     */
    public function create(Request $request){
       $validatedData = $request->validate([
            'TCKN' => 'required|string|max:11', // TCKN zorunlu ve en fazla 11 karakter
            'name' => 'required|string|max:255',
            'email' => 'nullable|email', // Email opsiyonel olabilir
            'doctor' => 'nullable|string|max:255',
            'gender' => 'nullable|string',
            'created_by' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
        ]);
        $existingPatient = DB::table('patients')
            ->where('TCKN', $validatedData['TCKN']) // TCKN eşleşmesi
            ->where('isDeleted', 0) // isDeleted 0 (aktif hasta)
            ->first(); // İlgili kaydı getir

        if ($existingPatient) {
            // Eğer TCKN eşleşen ve isDeleted = 0 olan bir kayıt bulunursa
            throw ValidationException::withMessages([
                'error' => 'Bu hasta zaten kayıtlı!'
            ]);
        }
        Patient::updateOrInsert(
            ['TCKN' => $validatedData['TCKN']],
            array_merge(
                [
                    'name' => $validatedData['name'],
                    'email' => $validatedData['email'] ?? null,
                    'doctor' => $validatedData['doctor'] ?? null,
                    'gender' => $validatedData['gender'] ?? null,
                    'phone_number' => $validatedData['phone_number'] ?? null,
                    'created_by' => $validatedData['created_by'] ?? null,
                    'updated_at' => now(),
                    'isDeleted' => "0",
                ],
                // created_at yalnızca yeni kayıt ekleniyorsa eklenir
                DB::table('patients')->where('TCKN', $validatedData['TCKN'])->exists()
                    ? [] // Eğer TCKN mevcutsa, created_at eklenmez
                    : ['created_at' => now()] // Eğer TCKN yoksa, created_at eklenir
            )
        );

        // Başarı mesajı dön
        return redirect()->back()->with('message', 'Hasta başarıyla eklendi');
    }
}
