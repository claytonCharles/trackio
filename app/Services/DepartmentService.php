<?php

namespace App\Services;

use App\Models\Departments\Department;
use App\Models\Departments\DepartmentMachine;
use App\Models\Departments\DepartmentMachineHistory;
use App\Models\Machines\Machine;
use App\Models\Machines\MachineStatus;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    public function listDepartments(array $filters): array
    {
        $result = [];
        try {
            $term = strip_tags($filters['search'] ?? '');
            $paginated = Department::query()
                ->withCount('departmentMachines')
                ->search($term)
                ->latest()
                ->paginate(10);

            $result = [
                'listDepartments' => $paginated->items(),
                'pagination' => [
                    'currentPage' => $paginated->currentPage(),
                    'lastPage' => $paginated->lastPage(),
                    'perPage' => $paginated->perPage(),
                    'totalItems' => $paginated->total(),
                ],
            ];
        } catch (Exception $exc) {
            LogService::error("Falhou ao listar os departamentos! ERROR {$exc->getMessage()}");
        }

        return $result;
    }

    public function loadFullDepartment(Department $department): Department
    {
        $department->load([
            'createdBy:id,name',
            'updatedBy:id,name',
            'departmentMachines.machine.category:id,name',
            'departmentMachines.machine.manufacturer:id,name',
            'departmentMachines.machine.status:id,name',
        ]);

        $department->setRelation('histories', DepartmentMachineHistory::query()
            ->with([
                'machine:id,name', 
                'createdBy:id,name', 
                'previousDepartment:id,name'
            ])
            ->where('department_id', $department->id)
            ->orWhere('previous_department_id', $department->id)
            ->latest('modified_at')
            ->get()
        );

        return $department;
    }

    public function storeDepartment(array $props): array
    {
        $result = [];
        try {
            $creator = ['created_by' => Auth::id(), 'updated_by' => Auth::id()];
            $department = Department::create([...$props, ...$creator]);
            $result = $department->toArray();
            LogService::created("Cadastrou um novo departamento #{$department->id}!");
        } catch (Exception $exc) {
            LogService::error("Falhou ao criar departamento! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function updateDepartment(array $props, Department $department): array
    {
        $result = [];
        try {
            $department->update([...$props, 'updated_by' => Auth::id()]);
            $result = $department->toArray();
            LogService::updated("Atualizou o departamento #{$department->id}!");
        } catch (Exception $exc) {
            LogService::error("Falhou ao atualizar departamento #{$department->id}! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }

    public function deactivateDepartment(Department $department): bool
    {
        try {
            $hasMachines = $department->machines()->exists();
            if ($hasMachines) {
                return false;
            }

            $department->update(['updated_by' => Auth::id(), 'deleted_at' => Carbon::now()]);

            LogService::deactivate("Desativou o departamento #{$department->id}!");

            return true;
        } catch (Exception $e) {
            LogService::error("Falhou ao desativar departamento #{$department->id}! ERROR: {$e->getMessage()}");

            return false;
        }
    }

    public function linkMachine(array $propsMachine, Department $department): bool
    {
        try {
            $machine = Machine::findOrFail($propsMachine['machine_id']);
            DB::transaction(function () use ($machine, $department) {
                DepartmentMachine::create([
                    'department_id' => $department->id,
                    'machine_id' => $machine->id,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                ]);

                $linkedStatus = MachineStatus::linkedStatus()->firstOrFail();
                $machine->update(['status_id' => $linkedStatus->id, 'updated_by' => Auth::id()]);
            });

            LogService::created("Máquina #{$machine->id} vinculada ao departamento #{$department->id}!");

            return true;
        } catch (Exception $e) {
            LogService::error("Falhou ao vincular máquina ao departamento! ERROR: {$e->getMessage()}");

            return false;
        }
    }

    public function unlinkMachine(Machine $machine, Department $department): bool
    {
        try {
            DB::transaction(function () use ($machine, $department) {
                $dm = DepartmentMachine::where('machine_id', $machine->id)
                    ->where('department_id', $department->id)
                    ->firstOrFail();

                $dm->update(['updated_by' => Auth::id()]);
                $dm->delete();

                $storageStatus = MachineStatus::storageStatus()->firstOrFail();
                $machine->update(['status_id' => $storageStatus->id, 'updated_by' => Auth::id()]);
            });

            LogService::deactivate("Máquina #{$machine->id} desvinculada do departamento #{$department->id}!");

            return true;
        } catch (Exception $e) {
            LogService::error("Falhou ao desvincular máquina do departamento! ERROR: {$e->getMessage()}");

            return false;
        }
    }

    public function getAvailableMachines(array $filters): array
    {
        $result = [];
        try {
            $term = strip_tags($filters['search'] ?? '');
            $result = Machine::query()
                ->with(['category', 'status'])
                ->whereDoesntHave('departmentMachine')
                ->search($term)
                ->select(['id', 'name', 'serial_number', 'category_id', 'status_id'])
                ->limit(20)
                ->get()
                ->toArray();
        } catch (Exception $exc) {
            LogService::error("Falhou ao buscar máquinas disponíveis! ERROR: {$exc->getMessage()}");
        }

        return $result;
    }
}
