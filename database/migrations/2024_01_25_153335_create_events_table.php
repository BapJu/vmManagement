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
            $table->date('create_at');
            $table->date('delete_at');
            $table->char('ip', 45);
            $table->unsignedBigInteger('id_type_of_vm');
            $table->timestamps();

            $table->foreign('id_type_of_vm')->references('id')->on('type_of_vms');
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
