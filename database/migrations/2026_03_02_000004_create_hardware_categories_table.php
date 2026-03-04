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
        Schema::create('hardware_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->string('name');
            $table->boolean('is_system_category')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('history_hardware_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hardware_category_id')->constrained('hardware_categories');
            $table->foreignId('updated_by')->constrained('users');
            $table->string('name');
            $table->boolean('is_system_category')->default(false);
            $table->softDeletes();
            $table->string('modified_at')->useCurrent();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('
                CREATE OR REPLACE FUNCTION save_old_hardware_category_version()
                RETURNS TRIGGER AS $$
                BEGIN
                    INSERT INTO history_hardware_categories
                        (hardware_category_id, updated_by, name, is_system_category, deleted_at, modified_at)
                    VALUES 
                        (OLD.id, OLD.updated_by, OLD.name, OLD.is_system_category, OLD.deleted_at, NOW());
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            ');

            DB::statement('
                CREATE TRIGGER before_updated_hardware_categories
                BEFORE UPDATE ON hardware_categories
                FOR EACH ROW
                EXECUTE FUNCTION save_old_hardware_category_version();
            ');

        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP TRIGGER IF EXISTS before_updated_hardware_categories ON hardware_categories');
            DB::statement('DROP FUNCTION IF EXISTS save_old_hardware_category_version()');
        }

        Schema::dropIfExists('history_hardware_categories');
        Schema::dropIfExists('hardware_categories');
    }
};
