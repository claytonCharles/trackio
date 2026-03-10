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
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('manufacturer_id')->constrained('manufacturers');
            $table->foreignId('status_id')->constrained('machine_status');
            $table->string('name');
            $table->string('serial_number')->nullable();
            $table->string('inventory_number')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('xht_machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained('machines');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('manufacturer_id')->constrained('manufacturers');
            $table->foreignId('status_id')->constrained('machine_status');
            $table->string('name');
            $table->string('inventory_number')->nullable();
            $table->string('serial_number')->nullable();
            $table->softDeletes();
            $table->timestamp('modified_at');
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('
                CREATE OR REPLACE FUNCTION log_machine_history()
                RETURNS TRIGGER AS $$
                BEGIN
                    INSERT INTO xht_machines 
                        (machine_id, updated_by, manufacturer_id, status_id, name, inventory_number, serial_number, deleted_at, modified_at)
                    VALUES 
                        (OLD.id, OLD.updated_by, OLD.manufacturer_id, OLD.status_id, OLD.name, OLD.inventory_number, OLD.serial_number, OLD.deleted_at, NOW());
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            ');

            DB::statement('
                CREATE TRIGGER trg_machine_update
                BEFORE UPDATE ON machines
                FOR EACH ROW
                EXECUTE FUNCTION log_machine_history();
            ');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS trg_machine_update ON machines');
        DB::statement('DROP FUNCTION IF EXISTS log_machine_history()');

        Schema::dropIfExists('machines');
    }
};
