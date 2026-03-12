<?php

use App\Http\Controllers\Hardwares\HardwareController;
use App\Http\Controllers\Machines\MachineCloneController;
use App\Http\Controllers\Machines\MachineController;
use App\Http\Controllers\Manufacturers\ManufactureController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('roles', RoleController::class);
    Route::resource('hardwares', HardwareController::class);
    Route::resource('manufacturer', ManufactureController::class)->only(['store', 'update', 'destroy']);
    Route::resource('machines', MachineController::class);

    Route::get('machine-clone', [MachineCloneController::class, 'index'])->name('machine-clone.index');
    Route::post('machine-clone/{machine}', [MachineCloneController::class, 'store'])->name('machine-clone.store');

    Route::post('notifications/read', function () {
        Auth::user()->unreadNotifications()->update(['read_at' => now()]);

        return back();
    })->name('notifications.read');
});

require __DIR__ . '/settings.php';
