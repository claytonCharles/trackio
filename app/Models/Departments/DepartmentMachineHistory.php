<?php

namespace App\Models\Departments;

use App\Casts\BrasilDataCast;
use App\Models\Machines\Machine;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentMachineHistory extends Model
{
    protected $table = 'xht_departments_machines';

    protected $casts = [
        'modified_at' => BrasilDataCast::class
    ];

    public $timestamps = false;

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

        public function previousDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'previous_department_id');
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }
}
