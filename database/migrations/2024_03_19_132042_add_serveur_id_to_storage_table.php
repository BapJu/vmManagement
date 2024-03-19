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
        Schema::table('storage', function (Blueprint $table) {
            $table->unsignedBigInteger('serveur_id')->after('id');
            $table->foreign('serveur_id')->references('id')->on('serveur')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('storage', function (Blueprint $table) {
            //
        });
    }
};
