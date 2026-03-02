<?php

namespace App\Models;

use App\Enums\AuditAction;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = "audit_logs";

    protected $fillable = [
        'user_id',
        'action',
        'message',
        'created_at'
    ];

    /**
     * Get the attributes that should be cast.
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'action' => AuditAction::class,
            'created_at' => 'datetime',
        ];
    }
}