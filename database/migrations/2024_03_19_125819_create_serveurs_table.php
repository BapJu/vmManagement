<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('serveur', function (Blueprint $table) {
            $table->id();
            $table->string('adress_ip');
            $table->string('noeud');
            $table->string('ssh_user');
            $table->string('ssh_password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('serveur');
    }
};
