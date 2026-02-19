<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect("/login");
});

Route::get("dashboard", function () {
    return Inertia::render("auth/dashboard");
})->middleware(["auth"])->name("dashboard");