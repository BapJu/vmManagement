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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 20); // Longueur ajustée pour correspondre à votre script SQL
            $table->string('email', 20)->unique(); // Utilisez soit 'email' soit 'mail'
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 15); // Longueur ajustée
            $table->unsignedBigInteger('id_role'); // Ajout du champ id_role
            $table->rememberToken();
            $table->timestamps();

            // Définition de la clé étrangère pour id_role
            $table->foreign('id_role')->references('id')->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

