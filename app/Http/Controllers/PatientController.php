<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::all(); // Tüm hastaları al
        return inertia('Patients', ['patients' => $patients]);
    }
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->update($request->only(['TCKN', 'name', 'email', 'phone_number']));
        return redirect()->back()->with('message', 'Hasta başarıyla güncellendi.');
    }
}
