<?php

namespace App\Models\Machines;

use Illuminate\Database\Eloquent\Model;

class MachineStatus extends Model
{
    protected $table = 'machine_status';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name'
    ];
}
