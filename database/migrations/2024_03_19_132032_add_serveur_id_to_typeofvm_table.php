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
        Schema::table('typeofvm', function (Blueprint $table) {
            $table->unsignedBigInteger('serveur_id')->after('id'); // Assurez-vous que le type correspond à celui de la colonne `id` dans `serveurs`
            $table->foreign('serveur_id')->references('id')->on('serveur')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('typeofvm', function (Blueprint $table) {
            //
        });
    }
};
