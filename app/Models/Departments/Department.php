<?php

namespace App\Models\Departments;

use App\Models\Machines\Machine;
use App\Models\User;
use Database\Factories\Departments\DepartmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'departments';

    protected $fillable = [
        'created_by',
        'updated_by',
        'name',
        'description',
        'location',
        'deleted_at',
    ];

    protected static function newFactory(): DepartmentFactory
    {
        return DepartmentFactory::new();
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function departmentMachines(): HasMany
    {
        return $this->hasMany(DepartmentMachine::class);
    }

    public function machines(): HasManyThrough
    {
        return $this->hasManyThrough(
            Machine::class,
            DepartmentMachine::class,
            'department_id',
            'id',
            'id',
            'machine_id'
        );
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'ilike', "%{$search}%")
                ->orWhere('location', 'ilike', "%{$search}%");
        });
    }
}
