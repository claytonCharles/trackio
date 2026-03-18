<?php

namespace App\Http\Controllers\Departments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Departments\DepartmentSaveRequest;
use App\Http\Requests\Departments\DepartmentSearchRequest;
use App\Models\Departments\Department;
use App\Services\DepartmentService;
use App\Support\FlashMsg;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function __construct(private DepartmentService $departmentService)
    {
        $this->middleware('permission:read departments')->only(['index', 'show']);
        $this->middleware('permission:write departments')->only(['store', 'update']);
        $this->middleware('permission:delete departments')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(DepartmentSearchRequest $request)
    {
        $filters = $request->validated();
        $departments = $this->departmentService->listDepartments($filters);

        return Inertia::render('departments/index', [
            ...$departments,
            'filters' => $filters,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DepartmentSaveRequest $request)
    {
        $data = $request->validated();
        $department = $this->departmentService->storeDepartment($data);

        if (empty($department)) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possível criar o departamento.'));
        }

        return redirect(route('departments.show', ['department' => $department['id']]))
            ->with('flashMsg', FlashMsg::success('Departamento criado com sucesso!'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        $department = $this->departmentService->loadFullDepartment($department);

        return Inertia::render('departments/show', ['department' => $department]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DepartmentSaveRequest $request, Department $department)
    {
        $data = $request->validated();
        $dept = $this->departmentService->updateDepartment($data, $department);

        if (empty($dept)) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possível atualizar o departamento.'));
        }

        return back()->with('flashMsg', FlashMsg::success('Departamento atualizado com sucesso!'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        $ok = $this->departmentService->deactivateDepartment($department);

        if (! $ok) {
            return back()->with(
                'flashMsg',
                FlashMsg::error('Não é possível desativar um departamento que possui máquinas.')
            );
        }

        return redirect(route('departments.index'))
            ->with('flashMsg', FlashMsg::success('Departamento desativado com sucesso!'));
    }
}
