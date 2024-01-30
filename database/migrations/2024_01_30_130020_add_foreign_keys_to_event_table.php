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
        Schema::table('event', function (Blueprint $table) {
            $table->foreign(['id_user'], 'event_user_fk')->references(['id'])->on('user');
            $table->foreign(['id_typeofvm'], 'event_typeofvm0_fk')->references(['id'])->on('typeofvm');
            $table->foreign(['id_storage'], 'event_storage1_fk')->references(['id'])->on('storage');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('event', function (Blueprint $table) {
            $table->dropForeign('event_user_fk');
            $table->dropForeign('event_typeofvm0_fk');
            $table->dropForeign('event_storage1_fk');
        });
    }
};
