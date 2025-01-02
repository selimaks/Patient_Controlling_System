<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\AppointmentFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    /** @use HasFactory<AppointmentFactory> */
    use HasFactory;
    //
    protected $table = 'appointments';
    protected $fillable = [
        'created_by',
        'appointment_date',
        'appointment_time',
        'status',
        'doctor_name',
        'patient_id',
        'operation',
        'notes',
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'TCKN');
    }
}
