<?php

use App\Http\Controllers\Appointment;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Operations;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [Dashboard::class, 'dashboard'])->name('dashboard');
    Route::put('/dashboard/complete/{id}', [Dashboard::class, 'completed'])->name('dashboard.completed');
    Route::post('/dashboard/fetch/{id}', [Dashboard::class, 'fetch'])->name('dashboard.fetch');
    Route::put('/dashboard/cancel/{id}', [Dashboard::class, 'canceled'])->name('dashboard.canceled');

    Route::get('/appointments', [Appointment::class, 'index'])->name('appointments');
    Route::post('/appointments/create', [Appointment::class, 'create'])->name('appointments.create');
    Route::put('/appointments/delete', [Appointment::class, 'delete'])->name('appointments.delete');

    Route::put('operations/createOperation', [Operations::class, 'createOperation'])->name('operations.createOperation');
    Route::put('operations/deleteOperations/', [Operations::class, 'deleteOperations'])->name('operations.deleteOperations');

    Route::get('/patients', [PatientController::class, 'index'])->name('patients');
    Route::post('/patients/getAppointmentRecords', [PatientController::class, 'getAppointmentsRecord'])->name('patients.getAppointmentsRecord');
    Route::put('/patients/update/{id}', [PatientController::class, 'update'])->name('patients.update');
    Route::put('/patients/delete/{id}', [PatientController::class, 'delete'])->name('patients.delete');
    Route::post('/patients/create', [PatientController::class, 'create'])->name('patients.create');
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
