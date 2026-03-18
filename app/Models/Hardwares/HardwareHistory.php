<?php

namespace App\Models\Hardwares;

use App\Casts\BrasilDataCast;
use App\Models\Manufacturers\Manufacturer;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HardwareHistory extends Model
{
    protected $table = 'xht_hardwares';

    public $timestamps = false;

    protected $fillable = [
        'hardware_id',
        'updated_by',
        'category_id',
        'status_id',
        'manufacturer_id',
        'inventory_number',
        'serial_number',
        'name',
        'description',
        'notes',
        'modified_at',
    ];

    protected $casts = [
        'modified_at' => BrasilDataCast::class
    ];

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
}
