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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('xht_departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained('departments');
            $table->foreignId('updated_by')->constrained('users');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->softDeletes();
            $table->timestamp('modified_at')->useCurrent();
        });

        DB::statement('
            CREATE OR REPLACE FUNCTION log_department_history()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO xht_departments 
                    (department_id, updated_by, name, description, location, deleted_at, modified_at)
                VALUES 
                    (OLD.id, OLD.updated_by, OLD.name, OLD.description, OLD.location, OLD.deleted_at, NOW());
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ');

        DB::statement('
            CREATE TRIGGER trg_department_update
            BEFORE UPDATE ON departments
            FOR EACH ROW
            EXECUTE FUNCTION log_department_history();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS trg_department_update ON departments');
        DB::statement('DROP FUNCTION IF EXISTS log_department_history()');

        Schema::dropIfExists('xht_departments');
        Schema::dropIfExists('departments');
    }
};
