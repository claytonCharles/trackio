<?php

namespace App\Models\Hardwares;

use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
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

    public function createdBy()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }

    public function updatedBy()
    {
        return $this->hasOne(User::class, 'id', 'updated_by');
    }

    public function category()
    {
        return $this->hasOne(HardwareCategory::class, 'id', 'category_id');
    }

    public function status()
    {
        return $this->hasOne(HardwareStatus::class, 'id', 'status_id');
    }

    public function manufacturer()
    {
        return $this->hasOne(Manufacturer::class, 'id', 'manufacturer_id');
    }

    public function getUpdatedAtFormattedAttribute()
    {
        return $this->updated_at->subHours(3)->format('d/m/Y à\s H:i');
    }
}
