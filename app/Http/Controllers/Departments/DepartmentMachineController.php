<?php

namespace App\Http\Controllers\Departments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Departments\DepartmentMachineStoreRequest;
use App\Models\Departments\Department;
use App\Models\Machines\Machine;
use App\Services\DepartmentService;
use App\Support\FlashMsg;
use Illuminate\Http\Request;

class DepartmentMachineController extends Controller
{
    public function __construct(private DepartmentService $departmentService)
    {
        $this->middleware('permission:write departments')->only(['index', 'store']);
        $this->middleware('permission:delete departments')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->validate(['search' => 'nullable', 'string']);
        $machines = $this->departmentService->getAvailableMachines($data);

        return response()->json(['machines' => $machines]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DepartmentMachineStoreRequest $request, Department $department)
    {
        $data = $request->validated();
        $ok = $this->departmentService->linkMachine($data, $department);

        if (! $ok) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possível vincular a máquina.'));
        }

        return back()->with('flashMsg', FlashMsg::success('Máquina vinculada com sucesso!'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department, Machine $machine)
    {
        $ok = $this->departmentService->unlinkMachine($machine, $department);

        if (! $ok) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possível desvincular a máquina.'));
        }

        return back()->with('flashMsg', FlashMsg::success('Máquina desvinculada com sucesso!'));
    }
}
