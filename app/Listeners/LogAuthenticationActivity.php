<?php

namespace App\Listeners;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;

class LogAuthenticationActivity
{
    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        if ($event instanceof Login) {
            $userId = $event->user->id;
            $userName = $event->user->name;

            AuditLog::create([
                'user_id' => $userId,
                'action' => AuditAction::LOGIN,
                'message' => "Usuário $userId :: $userName entrou no sistema."
            ]);
        }

        if ($event instanceof Logout) {
            $userId = $event->user->id;
            $userName = $event->user->name;

            AuditLog::create([
                'user_id' => $userId,
                'action' => AuditAction::LOGOUT,
                'message' => "Usuário $userId :: $userName saiu do sistema."
            ]);
        }
    }
}
