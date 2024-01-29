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
        Schema::table('typeofvm', function (Blueprint $table) {
            $table->foreign(['id_localisation'], 'typeofvm_localisation_fk')->references(['id'])->on('localisation');
            $table->foreign(['id_subject'], 'typeofvm_subject0_fk')->references(['id'])->on('subject');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('typeofvm', function (Blueprint $table) {
            $table->dropForeign('typeofvm_localisation_fk');
            $table->dropForeign('typeofvm_subject0_fk');
        });
    }
};
