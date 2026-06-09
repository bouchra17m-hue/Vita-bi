<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentDetailsToOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Check if columns already exist before adding them
            if (!Schema::hasColumn('orders', 'address')) {
                $table->string('address')->nullable();
            }
            if (!Schema::hasColumn('orders', 'city')) {
                $table->string('city')->nullable();
            }
            if (!Schema::hasColumn('orders', 'zip_code')) {
                $table->string('zip_code')->nullable();
            }
            if (!Schema::hasColumn('orders', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (!Schema::hasColumn('orders', 'card_name')) {
                $table->string('card_name')->nullable();
            }
            if (!Schema::hasColumn('orders', 'card_number')) {
                $table->string('card_number')->nullable();
            }
            if (!Schema::hasColumn('orders', 'expiry')) {
                $table->string('expiry')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'address',
                'city',
                'zip_code',
                'phone',
                'card_name',
                'card_number',
                'expiry'
            ]);
        });
    }
}
