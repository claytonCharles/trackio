<?php

namespace App\Models\Machines;

use App\Models\Hardwares\Hardware;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MachineHardware extends Model
{
    protected $table = 'machine_has_hardwares';

    protected $fillable = [
        'created_by', 
        'updated_by', 
        'machine_id', 
        'hardware_id'
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function hardware(): BelongsTo
    {
        return $this->belongsTo(Hardware::class);
    }
}
