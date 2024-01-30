<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('typeofvm', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description')->nullable();
            $table->integer('template_id');
            $table->integer('id_localisation')->nullable();
            $table->integer('id_subject')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('typeofvm');
    }
};
