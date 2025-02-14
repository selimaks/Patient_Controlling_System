<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Operations extends Model
{
    /** @use HasFactory<\Database\Factories\OperationsFactory> */
    use HasFactory, Notifiable;
    protected $fillable = [
        'created_by',
        'operation',
    ];
}
