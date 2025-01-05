<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('created_by')->default('system');
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->string('patient_id');
            $table->string('doctor_name');
            $table->enum('status', ['scheduled', 'completed', 'canceled', 'pending', 'missed']);
            $table->string('operation')->default('not_specified');
            $table->string('notes')->nullable();
            $table->string('prescription')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
