<?php

namespace App\Models\Machines;

use Database\Factories\Machines\MachineStatusFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachineStatus extends Model
{
    use HasFactory;

    protected $table = 'machine_status';

    protected static function newFactory(): MachineStatusFactory
    {
        return MachineStatusFactory::new();
    }

    public function scopeLinkedStatus($query)
    {
        return $query->where('tag', 'linked');
    }

    public function scopeStorageStatus($query)
    {
        return $query->where('tag', 'storage');

    }

    public function scopeBrokenStatus($query)
    {
        return $query->where('tag', 'broken');

    }

    public function scopeGuaranteeStatus($query)
    {
        return $query->where('tag', 'guarantee');

    }
}
