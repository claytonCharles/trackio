<?php

namespace App\Http\Controllers\Hardwares;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hardwares\HardwareSearchRequest;
use App\Http\Requests\Hardwares\HardwareStoreRequest;
use App\Http\Requests\Hardwares\HardwareUpdateRequest;
use App\Models\Hardwares\Hardware;
use App\Services\HardwareService;
use App\Support\FlashMsg;
use Inertia\Inertia;

class HardwareController extends Controller
{
    public function __construct(private HardwareService $hardwareService)
    {
        $this->middleware('permission:read hardwares')->only(['index', 'show']);
        $this->middleware('permission:write hardwares')->only(['create', 'store', 'edit', 'update']);
        $this->middleware('permission:delete hardwares')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(HardwareSearchRequest $request)
    {
        $filters = $request->validated();
        $hardwares = $this->hardwareService->searchHardwares($filters);

        return Inertia::render('hardwares/index', [
            ...$hardwares,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $creationComplements = $this->hardwareService->getAllCreationComplements();

        return Inertia::render('hardwares/save', $creationComplements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HardwareStoreRequest $request)
    {
        $data = $request->validated();
        $hardware = $this->hardwareService->storeHardware($data);
        if (empty($hardware)) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possivel realizar o cadastro do Hardware!'));
        }

        return redirect(route('hardwares.show', ['hardware' => $hardware['id']]));
    }

    /**
     * Display the specified resource.
     */
    public function show(Hardware $hardware)
    {
        $hardware = $this->hardwareService->loadFullHardware($hardware);
        if (! $hardware) {
            abort(404);
        }

        return Inertia::render('hardwares/show', [
            'hardware' => $hardware,
            'linked' => $this->hardwareService->checkUpdateEnable($hardware)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hardware $hardware)
    {
        $linked = $this->hardwareService->checkUpdateEnable($hardware);
        if ($linked) {
            return back()->with('flashMsg', FlashMsg::warning('Não e possivel editar um hardware que está em uso!'));
        }

        $complements = $this->hardwareService->getAllCreationComplements();
        $hardware = $this->hardwareService->loadDataEditHardware($hardware);
        if (! $hardware) {
            abort(404);
        }

        return Inertia::render('hardwares/save', [
            'hardware' => $hardware,
            ...$complements,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HardwareUpdateRequest $request, Hardware $hardware)
    {
        $data = $request->validated();
        $linked = $this->hardwareService->checkUpdateEnable($hardware);
        if ($linked) {
            return back()->with('flashMsg', FlashMsg::warning('Não e possivel editar um hardware que está em uso!'));
        }

        $data = array_filter($data, fn ($value) => ! is_null($value));
        $hardware = $this->hardwareService->updateHardware($data, $hardware);
        if (empty($hardware)) {
            return back()->with('flashMsg', FlashMsg::warning('Não foi possivel realizar a atualização do Hardware!'));
        }

        return redirect(route('hardwares.show', ['hardware' => $hardware['id']]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hardware $hardware)
    {
        $linked = $this->hardwareService->checkUpdateEnable($hardware);
        if ($linked) {
            return back()->with(
                'flashMsg',
                FlashMsg::warning('Não e possivel desativar um hardware que está em uso!')
            );
        }

        $result = $this->hardwareService->deactivateHardware($hardware);

        return redirect(route('hardwares.index'))->with('flashMsg', $result);
    }
}
