<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function index()
    {
        $patients = DB::table('patients')->orderBy('name')->get();
        return inertia('Patients', ['patients' => $patients]);
    }
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->update($request->only(['TCKN', 'name', 'email', 'phone_number']));
        return redirect()->back()->with('message', 'Hasta başarıyla güncellendi.');
    }
}
