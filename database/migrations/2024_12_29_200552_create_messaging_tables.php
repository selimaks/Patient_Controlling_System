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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id('conversation_id')->unique();
            $table->timestamps();
            $table->enum('created_by', ['patient', 'doctor/assistant']);
            $table->string('patient_id');
            $table->string('doctor_id');
            $table->enum('can_be_seen_by', ['doctor', 'doctor,assistant','all'] )->default('doctor');
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id('message_id')->unique();
            $table->string('conversation_id');
            $table->timestamps();
            $table->string('patient_id');
            $table->string('doctor_id');
            $table->string('message');
            $table->enum('message_type', ['text', 'image', 'video']);
            $table->boolean('message_deleted_status');
            $table->string('message_deleted_by')->nullable();
            $table->date('message_deleted_at')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messaging_tables');
        Schema::dropIfExists('conversations');
    }
};
