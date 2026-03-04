<?php

namespace App\Models\Hardwares;

use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hardware extends Model
{
    use SoftDeletes;

    protected $table = 'hardwares';

    protected $fillable = [
        'created_by',
        'updated_by',
        'category_id',
        'manufacturer_id',
        'status_id',
        'inventory_number',
        'serial_number',
        'name',
        'description',
        'deleted_at',
    ];

    protected $appends = ['updated_at_formatted'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'updated_at' => 'datetime',
        ];
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
        return $this->belongsTo(HardwareCategory::class, 'category_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(HardwareStatus::class, 'status_id');
    }

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class, 'manufacturer_id');
    }

    public function getUpdatedAtFormattedAttribute()
    {
        return $this->updated_at->subHours(3)->format('d/m/Y à\s H:i');
    }

    public function scopeSearch($query, ?string $search) 
    {
        if (blank($search)) return $query;

        return $query->where(fn($q) => 
            $q->where('name', 'ilike', "%{$search}%")
              ->orWhere('serial_number', 'ilike', "%{$search}%")
              ->orWhere('inventory_number', 'ilike', "%{$search}%")
        );
    }
}
