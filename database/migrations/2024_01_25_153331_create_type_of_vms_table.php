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
        Schema::create('type_of_vms', function (Blueprint $table) {
            $table->id();
            $table->integer('descr');
            $table->integer('template_id');
            $table->integer('lieu');
            $table->unsignedBigInteger('id_lieu')->nullable();
            $table->unsignedBigInteger('id_enseignement')->nullable();
            $table->timestamps();

            $table->foreign('id_lieu')->references('id')->on('lieux');
            $table->foreign('id_enseignement')->references('id')->on('enseignements');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('type_of_vms');
    }
};
