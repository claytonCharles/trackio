<?php

namespace App\Models\Hardwares;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hardware extends Model
{
    use SoftDeletes;

    protected $table = 'hardwares';

    protected $fillable = [
        'user_id',
        'category_id',
        'inventory_number',
        'serial_number',
        'name',
        'description',
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

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function category()
    {
        return $this->hasOne(HardwareCategory::class, 'id', 'category_id');
    }

    public function getUpdatedAtFormattedAttribute()
    {
        return $this->updated_at->subHours(3)->format('d/m/Y à\s H:i');
    }
}