<?php

namespace App\Http\Controllers\Hardwares;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hardwares\StoreHardwareRequest;
use App\Models\Hardwares\HardwareCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HardwareController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:write hardwares')->only(['create', 'store', 'update']);
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('hardwares/list');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $listCategories = HardwareCategory::all();
        return Inertia::render('hardwares/save', [
            "listCategories" => $listCategories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHardwareRequest $request)
    {
        $data = $request->validated();
        dd($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
