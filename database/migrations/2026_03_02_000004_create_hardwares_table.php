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
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('category_id')->constrained('hardware_categories');
            $table->foreignId('status_id')->constrained('hardware_status');
            $table->foreignId('manufacturer_id')->constrained('manufacturers');
            $table->string('inventory_number')->nullable()->unique();
            $table->string('serial_number')->nullable()->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('xht_hardwares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hardware_id')->constrained('hardwares');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('category_id')->constrained('hardware_categories');
            $table->foreignId('status_id')->constrained('hardware_status');
            $table->foreignId('manufacturer_id')->constrained('manufacturers');
            $table->string('inventory_number')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamp('modified_at');
        });

        DB::statement("
            CREATE OR REPLACE FUNCTION save_old_hardware_version()
            RETURNS TRIGGER AS $$
            DECLARE
                v_notes TEXT;
            BEGIN
                BEGIN
                    v_notes := current_setting('app.hardware_notes', true);
                    IF v_notes = '' THEN
                        v_notes := NULL;
                    END IF;
                EXCEPTION WHEN OTHERS THEN
                    v_notes := NULL;
                END;

                INSERT INTO xht_hardwares
                    (hardware_id, updated_by, category_id, status_id, manufacturer_id, inventory_number, 
                    serial_number, name, description, notes, deleted_at, modified_at)
                VALUES
                    (OLD.id, OLD.updated_by, OLD.category_id, OLD.status_id, OLD.manufacturer_id, 
                    OLD.inventory_number, OLD.serial_number, OLD.name, OLD.description, v_notes, OLD.deleted_at, NOW());
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ");

        DB::statement("
            CREATE TRIGGER before_updated_hardware
            BEFORE UPDATE ON hardwares
            FOR EACH ROW
            EXECUTE FUNCTION save_old_hardware_version();
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS before_updated_hardware ON hardwares');
        DB::statement('DROP FUNCTION IF EXISTS save_old_hardware_version()');

        Schema::dropIfExists('xht_hardwares');
        Schema::dropIfExists('hardwares');
    }
};
