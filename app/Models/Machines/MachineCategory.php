<?php

namespace App\Models\Machines;

use Database\Factories\Machines\MachineCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachineCategory extends Model
{
    use HasFactory;

    protected $table = 'machine_categories';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name',
        'is_system_category',
    ];

    protected static function newFactory(): MachineCategoryFactory
    {
        return MachineCategoryFactory::new();
    }
}
