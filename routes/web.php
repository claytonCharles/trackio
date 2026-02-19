<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render("home");
})->name("home");

Route::get("exemple", function () {
    return Inertia::render("guest/exemple");
})->name("exemple");