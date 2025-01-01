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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->boolean('isDeleted')->default(false);
            $table->string('created_by')->default('system');
            $table->string('name', 50);
            $table->string('TCKN')->unique();
            $table->string('doctor')->nullable();
            $table->string('phone_number', 20)->unique();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
