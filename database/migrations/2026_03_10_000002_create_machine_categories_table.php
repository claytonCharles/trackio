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
        Schema::create('machine_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->boolean('is_system_category')->default(false);
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('xht_machine_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_category_id')->constrained('machine_categories');
            $table->foreignId('updated_by')->constrained('users');
            $table->boolean('is_system_category')->default(false);
            $table->string('name');
            $table->softDeletes();
            $table->string('modified_at')->useCurrent();
        });

        DB::statement('
            CREATE OR REPLACE FUNCTION save_old_machine_category_version()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO xht_machine_categories
                    (machine_category_id, updated_by, is_system_category, name, deleted_at, modified_at)
                VALUES 
                    (OLD.id, OLD.updated_by, OLD.is_system_category, OLD.name, OLD.deleted_at, NOW());
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ');

        DB::statement('
            CREATE TRIGGER before_updated_machine_categories
            BEFORE UPDATE ON machine_categories
            FOR EACH ROW
            EXECUTE FUNCTION save_old_machine_category_version();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS before_updated_machine_categories ON machine_categories');
        DB::statement('DROP FUNCTION IF EXISTS save_old_machine_category_version()');
        
        Schema::dropIfExists('xht_machine_categories');
        Schema::dropIfExists('machine_categories');
    }
};
