<?php

namespace App\Models\Departments;

use App\Models\User;
use App\Models\Machines\Machine;
use Illuminate\Database\Eloquent\Model;

class RoomMachineHistory extends Model
{
    protected $table = 'xht_rooms_machines';

    public $timestamps = false;

    protected $fillable = [];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function previousRoom()
    {
        return $this->belongsTo(Room::class, 'previous_room_id');
    }

    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }
}
