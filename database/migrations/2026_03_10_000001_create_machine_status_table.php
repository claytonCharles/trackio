<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('machine_status', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->boolean('only_system')->default(false);
            $table->boolean('is_room_binding')->default(false);
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement('
            CREATE UNIQUE INDEX ms_only_one_binding_true
            ON machine_status (is_room_binding)
            WHERE is_room_binding = true
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS ms_only_one_binding_true');
        
        Schema::dropIfExists('machine_status');
    }
};
