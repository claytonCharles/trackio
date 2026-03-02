<?php

namespace App\Models\Hardwares;

use Illuminate\Database\Eloquent\Model;

class HardwareCategory extends Model
{
    protected $table = 'hardware_categories';

    protected $fillable = [
        'user_id',
        'name',
        'is_system_category'
    ];
}
