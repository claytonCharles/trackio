<?php

namespace App\Models\Hardwares;

use Database\Factories\Hardwares\HardwareCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HardwareCategory extends Model
{
    use HasFactory;

    protected $table = 'hardware_categories';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name',
        'is_system_category',
    ];

    protected static function newFactory(): HardwareCategoryFactory
    {
        return HardwareCategoryFactory::new();
    }
}
