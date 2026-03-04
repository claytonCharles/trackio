<?php

namespace App\Models\Manufacturers;

use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model
{
    protected $table = 'manufacturers';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name'
    ];
}
