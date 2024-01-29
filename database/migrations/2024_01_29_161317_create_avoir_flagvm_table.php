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
        Schema::create('avoir_flagvm', function (Blueprint $table) {
            $table->integer('id');
            $table->integer('id_typeofvm');

            $table->primary(['id', 'id_typeofvm']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('avoir_flagvm');
    }
};
