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
        Schema::create('machine_has_hardwares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('machine_id')->constrained('machines');
            $table->foreignId('hardware_id')->constrained('hardwares')->unique();
            $table->timestamps();

            $table->unique(['machine_id', 'hardware_id']);
        });

        Schema::create('xht_machines_hardwares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hardware_id')->constrained('hardwares');
            $table->foreignId('machine_id')->nullable()->constrained('machines')->nullOnDelete();
            $table->foreignId('previous_machine_id')->nullable()->constrained('machines')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->string('action');
            $table->timestamp('modified_at')->useCurrent();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("
                CREATE OR REPLACE FUNCTION log_machine_hardware_history()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF (TG_OP = 'INSERT') THEN
                        INSERT INTO xht_machines_hardwares
                            (hardware_id, machine_id, previous_machine_id, created_by, action, modified_at)
                        VALUES
                            (NEW.hardware_id, NEW.machine_id, NULL, NEW.created_by, 'attached', NOW());
                        RETURN NEW;
                    END IF;

                    IF (TG_OP = 'UPDATE' AND NEW.machine_id IS DISTINCT FROM OLD.machine_id) THEN
                        INSERT INTO xht_machines_hardwares
                            (hardware_id, machine_id, previous_machine_id, created_by, action, modified_at)
                        VALUES
                            (NEW.hardware_id, NEW.machine_id, OLD.machine_id, NEW.updated_by, 'moved', NOW());
                        RETURN NEW;
                    END IF;

                    IF (TG_OP = 'DELETE') THEN
                        INSERT INTO xht_machines_hardwares
                            (hardware_id, machine_id, previous_machine_id, created_by, action, modified_at)
                        VALUES
                            (OLD.hardware_id, NULL, OLD.machine_id, OLD.updated_by, 'detached', NOW());
                        RETURN OLD;
                    END IF;

                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            ");

            DB::statement('
                CREATE TRIGGER trg_machine_hardware_insert
                AFTER INSERT ON machine_has_hardwares
                FOR EACH ROW
                EXECUTE FUNCTION log_machine_hardware_history();
            ');

            DB::statement('
                CREATE TRIGGER trg_machine_hardware_update
                AFTER UPDATE ON machine_has_hardwares
                FOR EACH ROW
                EXECUTE FUNCTION log_machine_hardware_history();
            ');

            DB::statement('
                CREATE TRIGGER trg_machine_hardware_delete
                AFTER DELETE ON machine_has_hardwares
                FOR EACH ROW
                EXECUTE FUNCTION log_machine_hardware_history();
            ');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS trg_machine_hardware_insert ON machine_has_hardwares');
        DB::statement('DROP TRIGGER IF EXISTS trg_machine_hardware_update ON machine_has_hardwares');
        DB::statement('DROP TRIGGER IF EXISTS trg_machine_hardware_delete ON machine_has_hardwares');
        DB::statement('DROP FUNCTION IF EXISTS log_machine_hardware_history()');

        Schema::dropIfExists('xht_machines_hardwares');
        Schema::dropIfExists('machine_has_hardwares');
    }
};
