<?php

namespace App\Http\Controllers\Hardwares;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hardwares\HardwareUpdateRequest;
use App\Http\Requests\Hardwares\HardwareSearchRequest;
use App\Http\Requests\Hardwares\HardwareStoreRequest;
use App\Models\Hardwares\Hardware;
use App\Models\Hardwares\HardwareCategory;
use App\Services\HardwareService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HardwareController extends Controller
{
    private HardwareService $hardwareService;

    public function __construct()
    {
        $this->middleware('permission:read hardwares')->only(['index']);
        $this->middleware('permission:write hardwares')->only(['create', 'store', 'edit', 'update']);
        $this->middleware('permission:delete hardwares')->only(['destroy']);

        $this->hardwareService = new HardwareService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(HardwareSearchRequest $request)
    {
        $filters = $request->validated();
        $hardwares = $this->hardwareService->searchHardwares($filters);

        return Inertia::render('hardwares/list', [
            ...$hardwares,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $createComplements = $this->hardwareService->getAllComplements();
        return Inertia::render('hardwares/save', $createComplements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HardwareStoreRequest $request)
    {
        $data = $request->validated();
        $hardware = $this->hardwareService->storeHardware($data, $request->user());
        if (empty($hardware)) {
            return back()->with('flashMsg', 'Não foi possivel realizar o cadastro do Hardware!');
        }

        return redirect(route('hardwares.show', ['hardware' => $hardware['id']]));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $hardware = $this->hardwareService->getHardwareInfoById($id);
        if (empty($hardware)) {
            abort(404);
        }

        return Inertia::render('hardwares/show', [
            'hardware' => $hardware,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $hardware = $this->hardwareService->getHardwareInfoById($id);
        $complements = $this->hardwareService->getAllComplements();
        return Inertia::render('hardwares/save', [
            'hardware' => $hardware,
            ...$complements
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HardwareUpdateRequest $request, string $id)
    {
        $data = $request->validated();
        $data = array_filter($data, fn ($value) => ! is_null($value));
        $hardware = $this->hardwareService->updateHardware($data, $id, $request->user());
        if (empty($hardware)) {
            return back()->with('flashMsg', 'Não foi possivel realizar a atualização do Hardware!');
        }

        return redirect(route('hardwares.show', ['hardware' => $id]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $result = $this->hardwareService->deactivateHardware($id, $user);
        return redirect(route('hardwares.index'))->with('flashMsg', $result);
    }
}
