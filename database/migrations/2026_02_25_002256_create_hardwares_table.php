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
        Schema::create('hardwares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('category_id')->constrained('hardware_categories');
            $table->string('inventory_number')->nullable()->unique();
            $table->string('serial_number')->nullable()->unique();
            $table->string('name');
            $table->text('description');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('history_hardware', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hardware_id')->constrained('hardwares');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('category_id')->constrained('hardware_categories');
            $table->string('inventory_number')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('name');
            $table->text('description');
            $table->softDeletes();
            $table->string('modified_at')->useCurrent();
        });

        DB::statement('
            CREATE OR REPLACE FUNCTION save_old_hardware_version()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO history_hardware 
                    (hardware_id, user_id, category_id, inventory_number, serial_number, name, description, deleted_at, modified_at)
                VALUES 
                    (OLD.id, OLD.user_id, OLD.category_id, OLD.inventory_number, OLD.serial_number, OLD.name, OLD.description, OLD.deleted_at, NOW());
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ');

        DB::statement('
            CREATE TRIGGER before_updated_hardware
            BEFORE UPDATE ON hardwares
            FOR EACH ROW
            EXECUTE FUNCTION save_old_hardware_version();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS before_updated_hardware ON hardwares');
        DB::statement('DROP FUNCTION IF EXISTS save_old_hardware_version()');
        Schema::dropIfExists('history_hardware');
        Schema::dropIfExists('hardwares');
    }
};
