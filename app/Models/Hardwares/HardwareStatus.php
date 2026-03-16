<?php

namespace App\Models\Hardwares;

use Database\Factories\Hardwares\HardwareStatusFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HardwareStatus extends Model
{
    use HasFactory;

    protected $table = 'hardware_status';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name',
    ];

    protected static function newFactory(): HardwareStatusFactory
    {
        return HardwareStatusFactory::new();
    }

    public function scopeLinkedStatus($query)
    {
        return $query->where('is_machine_binding', true);
    }

    public function scopeStorageStatus($query)
    {
        return $query->where('name', 'Armazenado');
    }
}
