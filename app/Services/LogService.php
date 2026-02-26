<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LogService
{
    public static function created(string $message)
    {
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => AuditAction::CREATED,
            'message' => $message,
        ]);

        LogService::info($message);
    }

    public static function updated(string $message)
    {
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => AuditAction::UPDATED,
            'message' => $message,
        ]);

        LogService::info($message);
    }

    public static function deactivate(string $message)
    {
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => AuditAction::DELETED,
            'message' => $message,
        ]);

        LogService::info($message);
    }

    public static function info(string $message)
    {
        Log::channel('daily')->info($message, [
            'user' => Auth::id(),
        ]);
    }

    public static function error(string $message)
    {
        Log::channel('daily')->error($message, [
            'user' => Auth::id(),
        ]);
    }
}
