<?php

namespace App\Models\Machines;

use App\Models\Departments\Room;
use App\Models\Departments\RoomMachine;
use App\Models\Hardwares\Hardware;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Database\Factories\Machines\MachineFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Machine extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'machines';

    protected $fillable = [
        'created_by',
        'updated_by',
        'category_id',
        'manufacturer_id',
        'status_id',
        'name',
        'serial_number',
        'inventory_number',
        'deleted_at',
    ];

    protected static function newFactory(): MachineFactory
    {
        return MachineFactory::new();
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MachineCategory::class, 'category_id');
    }

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class, 'manufacturer_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(MachineStatus::class, 'status_id');
    }

    public function machineHardwares(): HasMany
    {
        return $this->hasMany(MachineHardware::class);
    }

    public function hardwares(): HasManyThrough
    {
        return $this->hasManyThrough(
            Hardware::class,
            MachineHardware::class,
            'machine_id',
            'id',
            'id',
            'hardware_id'
        );
    }

    public function roomMachine()
    {
        return $this->hasOne(RoomMachine::class);
    }

    public function room()
    {
        return $this->hasOneThrough(
            Room::class,
            RoomMachine::class,
            'machine_id',
            'id',
            'id',
            'room_id'
        );
    }

    public function scopeSearch($query, ?string $search)
    {
        if (blank($search)) {
            return $query;
        }

        return $query->where(fn ($q) => $q->where('machines.name', 'ilike', "%{$search}%")
            ->orWhere('serial_number', 'ilike', "%{$search}%")
            ->orWhere('inventory_number', 'ilike', "%{$search}%")
            ->orWhereRelation('hardwares', 'name', 'ilike', "%{$search}%")
        );
    }
}
