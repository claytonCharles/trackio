<?php

namespace App\Models\Hardwares;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hardware extends Model
{
    use SoftDeletes;

    protected $table = 'hardwares';

    protected $with = ['category'];

    protected $fillable = [
        'user_id',
        'category_id',
        'inventory_number',
        'serial_number',
        'name',
        'description',
    ];

    public function category()
    {
        return $this->hasOne(HardwareCategory::class, 'id', 'category_id');
    }
}