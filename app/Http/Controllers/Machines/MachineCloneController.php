<?php

namespace App\Http\Controllers\Machines;

use App\Http\Controllers\Controller;
use App\Http\Requests\Machines\MachineCloneSearchRequest;
use App\Http\Requests\Machines\MachineCloneStoreRequest;
use App\Models\Machines\Machine;
use App\Services\MachineService;
use App\Support\FlashMsg;
use Inertia\Inertia;

class MachineCloneController extends Controller
{
    public function __construct(private MachineService $machineService)
    {
        $this->middleware('permission:clone machines');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(MachineCloneSearchRequest $request)
    {
        $filters = $request->validated();
        $data = $this->machineService->searchMachinesForTemplate($filters);

        return Inertia::render('machines/clone', [
            ...$data,
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Machine $machine, MachineCloneStoreRequest $request)
    {
        $data = $request->validated();
        $copies = $data['copies'];
        $ok = $this->machineService->cloneAvaliable($machine);
        if (! $ok) {
            return back()->with('flashMsg', FlashMsg::warning('Não e possivel clonar máquinas avulsas!'));
        }

        $ok = $this->machineService->dispatchCloneBatch($machine, $copies);

        if (! $ok) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possível iniciar a clonagem.'));
        }

        return back()->with('flashMsg', FlashMsg::success(
            "Clonagem de \"{$machine->name}\" iniciada! {$copies} cópia(s) serão criadas em breve."
        ));
    }
}
