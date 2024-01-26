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
        Schema::create('typeOfVms', function (Blueprint $table) {
            $table->id();
            $table->integer('description');
            $table->integer('templateId');
            $table->unsignedBigInteger('location')->nullable();
            $table->unsignedBigInteger('course')->nullable();
            $table->timestamps();
            $table->foreign('location')->references('id')->on('locations');
            $table->foreign('course')->references('id')->on('courses');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('typeOfVms');
    }
};
