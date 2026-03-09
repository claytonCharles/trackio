<?php

namespace App\Models\Manufacturers;

use Database\Factories\Manufacturers\ManufacturerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model
{
    use HasFactory;

    protected $table = 'manufacturers';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name'
    ];

    protected static function newFactory(): ManufacturerFactory
    {
        return ManufacturerFactory::new();
    }
}
