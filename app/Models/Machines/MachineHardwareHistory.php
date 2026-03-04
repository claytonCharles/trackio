<?php

namespace App\Models\Machines;

use App\Models\Hardwares\Hardware;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MachineHardwareHistory extends Model
{
    protected $table = 'machines_hardwares_history';

    public $timestamps = false;

    protected $fillable = [
        'hardware_id',
        'machine_id',
        'previous_machine_id',
        'created_by',
        'action',
        'modified_at',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function hardware(): BelongsTo
    {
        return $this->belongsTo(Hardware::class);
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function previousMachine(): BelongsTo
    {
        return $this->belongsTo(Machine::class, 'previous_machine_id');
    }
}
