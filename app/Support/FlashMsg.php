<?php

namespace App\Support;

class FlashMsg
{
    public static function success(string $message): array
    {
        return ['type' => 'success', 'message' => $message];
    }

    public static function error(string $message): array
    {
        return ['type' => 'error', 'message' => $message];
    }

    public static function warning(string $message): array
    {
        return ['type' => 'warning', 'message' => $message];
    }

    public static function default(string $message): array
    {
        return ['type' => 'default', 'message' => $message];
    }
}