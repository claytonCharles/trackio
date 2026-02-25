<?php

namespace App\Http\Controllers\Hardwares;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hardwares\StoreHardwareRequest;
use App\Models\Hardwares\Hardware;
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
        $listHardwares = Hardware::all();
        return Inertia::render('hardwares/list', [
            'listHardwares' => $listHardwares
        ]);
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
        $hardware = Hardware::create([
            'user_id' => $request->user()->id,
            "category_id" => $data["category_id"],
            "inventory_number" => $data["inventory_number"],
            "serial_number" => $data["serial_number"],
            "name" => $data["name"],
            "description" => $data["description"]
        ]);

        return redirect('/hardwares');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $hardware = Hardware::find($id);
        return Inertia::render('hardwares/show', [
            'hardware' => $hardware
        ]);
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
