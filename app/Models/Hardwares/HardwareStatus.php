<?php

namespace App\Models\Hardwares;

use Illuminate\Database\Eloquent\Model;

class HardwareStatus extends Model
{
    protected $table = 'hardware_status';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name',
    ];

    public function scopeLinkedStatus($query)
    {
        return $query->where('name', 'Vinculado');
    }

    public function scopeStorageStatus($query)
    {
        return $query->where('name', 'Armazenado');
    }
}
