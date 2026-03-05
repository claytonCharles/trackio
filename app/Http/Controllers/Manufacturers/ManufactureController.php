<?php

namespace App\Http\Controllers\Manufacturers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manufacturers\ManufacturerSaveRequest;
use App\Services\ManufacturerService;
use App\Support\FlashMsg;
use Illuminate\Support\Facades\Auth;

class ManufactureController extends Controller
{
    private ManufacturerService $manufacturerService;

    public function __construct()
    {
        $this->middleware('permission:write manufacturers')->only(['store', 'update']);
        $this->middleware('permission:delete manufacturers')->only(['destroy']);
        $this->manufacturerService = new ManufacturerService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ManufacturerSaveRequest $request)
    {
        $data = $request->validated();
        $manufacturer = $this->manufacturerService->storeManufacturer($data, $request->user());
        if (empty($manufacturer)) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possivel realizar o cadastro do Fabricante!'));
        }

        return back()->with('flashMsg', FlashMsg::success("Cadastro do fabriante {$manufacturer['name']} realizado com sucesso!"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ManufacturerSaveRequest $request, string $id)
    {
        $data = $request->validated();
        $data = array_filter($data, fn ($value) => ! is_null($value));
        $manufacturer = $this->manufacturerService->updateManufacturer($data, $id, $request->user());
        if (empty($manufacturer)) {
            return back()->with('flashMsg', FlashMsg::error('Não foi possivel realizar a atualização do Fabricante!'));
        }

        return back()->with(
            'flashMsg', 
            FlashMsg::success("Atualização do fabriante {$manufacturer['name']} realizado com sucesso!")
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $result = $this->manufacturerService->deactivateManufacturer($id, $user);
        return back()->with('flashMsg', $result);
    }
}
