<?php

namespace App\Http\Controllers\Machines;

use App\Http\Controllers\Controller;
use App\Http\Requests\Machines\MachineHardwareSearchRequest;
use App\Http\Requests\Machines\MachineSearchRequest;
use App\Http\Requests\Machines\MachineStoreRequest;
use App\Http\Requests\Machines\MachineUpdateRequest;
use App\Models\Machines\Machine;
use App\Services\MachineService;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class MachineController extends Controller
{
    private MachineService $machineService;

    public function __construct()
    {
        $this->middleware('permission:read machines')->only(['index']);
        $this->middleware('permission:write machines')->only(['create', 'store', 'edit', 'update']);
        $this->middleware('permission:delete machines')->only(['destroy']);

        $this->machineService = new MachineService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(MachineSearchRequest $request)
    {
        $filters = $request->validated();
        $machines = $this->machineService->searchMachines($filters);

        return Inertia::render('machines/index', [
            ...$machines,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(MachineHardwareSearchRequest $request)
    {
        $filters = $request->validated();
        $creationComplements = $this->machineService->getAllCreationComplements($filters);

        return Inertia::render('machines/save', $creationComplements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MachineStoreRequest $request)
    {
        $data = $request->validated();
        $machineProps = Arr::except($data, 'hardware_ids');
        $message = $this->machineService->storeMachine($machineProps, $data['hardware_ids']);

        return redirect()->route('machines.index')->with('flashMsg', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(Machine $machine)
    {
        $machine = $this->machineService->loadFullMachine($machine);

        return Inertia::render('machines/show', [
            'machine' => $machine,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Machine $machine, MachineHardwareSearchRequest $request)
    {
        $filters = $request->validated();
        $editingData = $this->machineService->loadDataEditMachine($machine, $filters);

        return Inertia::render('machines/save', $editingData);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MachineUpdateRequest $request, Machine $machine)
    {
        $data = $request->validated();
        $newProps = Arr::except($data, 'hardware_ids');
        $result = $this->machineService->updateMachine($newProps, $data['hardware_ids'], $machine);

        return redirect()->route('machines.show', $machine)->with('flashMsg', $result);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Machine $machine)
    {
        $result = $this->machineService->deactivateMachine($machine);

        return redirect()->route('machines.index')->with('flashMsg', $result);
    }
}
