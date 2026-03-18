<?php

namespace App\Models\Departments;

use App\Models\Machines\Machine;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentMachine extends Model
{
    protected $table = 'department_has_machines';

    protected $fillable = [
        'created_by',
        'updated_by',
        'department_id',
        'machine_id',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }
}
