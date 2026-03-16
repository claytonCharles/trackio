<?php

namespace App\Models\Departments;

use App\Models\Machines\Machine;
use App\Models\User;
use Database\Factories\Departments\RoomFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'rooms';

    protected $fillable = [
        'created_by',
        'updated_by',
        'department_id',
        'name',
        'description',
        'deleted_at',
    ];

    protected static function newFactory(): RoomFactory
    {
        return RoomFactory::new();
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function roomMachines(): HasMany
    {
        return $this->hasMany(RoomMachine::class);
    }

    public function machines(): HasManyThrough
    {
        return $this->hasManyThrough(
            Machine::class,
            RoomMachine::class,
            'room_id',
            'id',
            'id',
            'machine_id'
        );
    }
}
