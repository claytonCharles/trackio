<?php

namespace App\Models\Departments;

use App\Models\Machines\Machine;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class RoomMachine extends Model
{
    protected $table = 'room_has_machines';

    protected $fillable = [
        'created_by',
        'updated_by',
        'room_id',
        'machine_id',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }
}
