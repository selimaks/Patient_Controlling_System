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
        'reason',
        'notes',
    ];
}
