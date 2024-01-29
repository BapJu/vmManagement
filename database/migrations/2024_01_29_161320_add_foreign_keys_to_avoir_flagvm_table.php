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
        Schema::table('avoir_flagvm', function (Blueprint $table) {
            $table->foreign(['id'], 'avoir_flagvm_flagvm_fk')->references(['id'])->on('flagvm');
            $table->foreign(['id_typeofvm'], 'avoir_flagvm_typeofvm0_fk')->references(['id'])->on('typeofvm');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('avoir_flagvm', function (Blueprint $table) {
            $table->dropForeign('avoir_flagvm_flagvm_fk');
            $table->dropForeign('avoir_flagvm_typeofvm0_fk');
        });
    }
};
