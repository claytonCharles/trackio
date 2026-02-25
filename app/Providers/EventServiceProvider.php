<?php

namespace App\Providers;

use App\Listeners\LogAuthenticationActivity;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $listener = new LogAuthenticationActivity();

        Event::listen(Login::class, [$listener, 'handle']);
        Event::listen(Logout::class, [$listener, 'handle']);
    }
}
