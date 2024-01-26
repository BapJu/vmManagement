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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->date('scheduledExpiry');
            $table->date('effectiveExpiry');
            $table->char('ip', 45);
            $table->boolean('active');
            $table->unsignedBigInteger('typeOfVm');
            $table->timestamps();

            $table->foreign('typeOfVm')->references('id')->on('typeOfVms');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
