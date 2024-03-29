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
        Schema::create('event', function (Blueprint $table) {
            $table->increments('id');
            $table->date('created_at');
            $table->date('scheduledexpiry')->nullable();
            $table->string('ip', 15);
            $table->date('effectiveexpiry')->nullable();
            $table->boolean('active');
            $table->integer('vmid');
            $table->integer('id_user');
            $table->integer('id_typeofvm');
            $table->integer('id_storage');
            $table->string('namevm', 20)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event');
    }
};
