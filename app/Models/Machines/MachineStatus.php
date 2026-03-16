<?php

namespace App\Models\Machines;

use Database\Factories\Machines\MachineStatusFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachineStatus extends Model
{
    use HasFactory;

    protected $table = 'machine_status';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name',
    ];

    protected static function newFactory(): MachineStatusFactory
    {
        return MachineStatusFactory::new();
    }

    public function scopeRoomStatus($query)
    {
        return $query->where('is_room_binding', true);
    }
}
