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
        Schema::create('manufacturers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('history_manufacturers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manufacturer_id')->constrained('manufacturers');
            $table->foreignId('updated_by')->constrained('users');
            $table->string('name');
            $table->softDeletes();
            $table->string('modified_at')->useCurrent();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('
                CREATE OR REPLACE FUNCTION save_old_manufacturer_version()
                RETURNS TRIGGER AS $$
                BEGIN
                    INSERT INTO history_manufacturers
                        (manufacturer_id, updated_by, name, deleted_at, modified_at)
                    VALUES 
                        (OLD.id, OLD.updated_by, OLD.name, OLD.deleted_at, NOW());
                    
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            ');

            DB::statement('
                CREATE TRIGGER before_updated_manufacturers
                BEFORE UPDATE ON manufacturers
                FOR EACH ROW
                EXECUTE FUNCTION save_old_manufacturer_version();
            ');

        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP TRIGGER IF EXISTS before_updated_manufacturers ON manufacturers');
            DB::statement('DROP FUNCTION IF EXISTS save_old_manufacturer_version()');
        }

        Schema::dropIfExists('history_manufacturers');
        Schema::dropIfExists('manufacturers');
    }
};
