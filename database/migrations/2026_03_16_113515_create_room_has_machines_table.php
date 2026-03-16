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
        Schema::create('room_has_machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('room_id')->constrained('rooms');
            $table->foreignId('machine_id')->unique()->constrained('machines');
            $table->timestamps();
        });

        Schema::create('xht_rooms_machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('room_id')->constrained('rooms');
            $table->foreignId('previous_room_id')->nullable()->constrained('machines');
            $table->foreignId('machine_id')->constrained('machines');
            $table->string('action');
            $table->text('notes')->nullable();
            $table->timestamp('modified_at')->useCurrent();
        });

        DB::statement("
            CREATE OR REPLACE FUNCTION log_room_machine_history()
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
                    INSERT INTO xht_rooms_machines (room_id, machine_id, created_by, action, notes, modified_at)
                    VALUES (NEW.room_id, NEW.machine_id, NEW.created_by, 'attached', v_notes, NOW());

                ELSIF TG_OP = 'UPDATE' AND OLD.room_id <> NEW.room_id THEN
                    INSERT INTO xht_rooms_machines (room_id, previous_room_id, machine_id, created_by, action, notes, modified_at)
                    VALUES (NEW.room_id, OLD.room_id, NEW.machine_id, NEW.created_by, 'moved', v_notes, NOW());

                ELSIF TG_OP = 'DELETE' THEN
                    INSERT INTO xht_rooms_machines (room_id, machine_id, created_by, action, notes, modified_at)
                    VALUES (OLD.room_id, OLD.machine_id, OLD.created_by, 'detached', v_notes, NOW());
                END IF;

                RETURN NEW;
            END;
            \$\$ LANGUAGE plpgsql;
        ");

        DB::statement('
            CREATE TRIGGER after_room_machine_change
            AFTER INSERT OR UPDATE OR DELETE ON room_has_machines
            FOR EACH ROW EXECUTE FUNCTION log_room_machine_history();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS after_room_machine_change ON room_has_machines');
        DB::statement('DROP FUNCTION IF EXISTS log_room_machine_history()');

        Schema::dropIfExists('xht_rooms_machines');
        Schema::dropIfExists('room_has_machines');
    }
};
