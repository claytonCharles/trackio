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
        Schema::create('department_has_machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('department_id')->constrained('departments');
            $table->foreignId('machine_id')->unique()->constrained('machines');
            $table->timestamps();
        });

        Schema::create('xht_departments_machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('machine_id')->constrained('machines');
            $table->foreignId('department_id')->nullable()->constrained('departments');
            $table->foreignId('previous_department_id')->nullable()->constrained('departments');
            $table->string('action');
            $table->text('notes')->nullable();
            $table->timestamp('modified_at')->useCurrent();
        });

        DB::statement("
            CREATE OR REPLACE FUNCTION log_department_machine_history()
            RETURNS TRIGGER AS \$\$
            DECLARE
                v_notes TEXT;
            BEGIN
                BEGIN
                    v_notes := current_setting('app.room_notes', true);
                    IF v_notes = '' THEN
                        v_notes := NULL;
                    END IF;
                EXCEPTION WHEN OTHERS THEN
                    v_notes := NULL;
                END;

                IF TG_OP = 'INSERT' THEN
                    INSERT INTO xht_departments_machines 
                        (department_id, machine_id, created_by, action, notes, modified_at)
                    VALUES 
                        (NEW.department_id, NEW.machine_id, NEW.created_by, 'attached', v_notes, NOW());

                ELSIF TG_OP = 'UPDATE' AND OLD.department_id <> NEW.department_id THEN
                    INSERT INTO xht_departments_machines 
                        (department_id, previous_department_id, machine_id, created_by, action, notes, modified_at)
                    VALUES 
                        (NEW.department_id, OLD.department_id, NEW.machine_id, NEW.created_by, 'moved', v_notes, NOW());

                ELSIF TG_OP = 'DELETE' THEN
                    INSERT INTO xht_departments_machines (machine_id, department_id, previous_department_id, created_by, action, notes, modified_at)
                    VALUES (OLD.machine_id, null, OLD.department_id, OLD.created_by, 'detached', v_notes, NOW());
                END IF;

                RETURN NEW;
            END;
            \$\$ LANGUAGE plpgsql;
        ");

        DB::statement('
            CREATE TRIGGER after_department_machine_change
            AFTER INSERT OR UPDATE OR DELETE ON department_has_machines
            FOR EACH ROW EXECUTE FUNCTION log_department_machine_history();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        DB::statement('DROP TRIGGER IF EXISTS after_department_machine_change ON department_has_machines');
        DB::statement('DROP FUNCTION IF EXISTS log_department_machine_history()');

        Schema::dropIfExists('xht_departments_machines');
        Schema::dropIfExists('department_has_machines');
    }
};
