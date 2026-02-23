<?php

use App\Http\Controllers\HardwareController;
use App\Http\Controllers\RoleController;
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
});