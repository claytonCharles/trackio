<?php

namespace App\Http\Requests\Machines;

use Illuminate\Foundation\Http\FormRequest;

class MachineStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'manufacturer_id' => ['required', 'exists:manufacturers,id'],
            'status_id' => ['required', 'exists:machine_status,id'],
            'name' => ['required', 'string', 'max:255'],
            'serial_number' => ['nullable', 'string', 'max:255', 'unique:machines,serial_number'],
            'inventory_number' => ['nullable', 'string', 'max:255', 'unique:machines,inventory_number'],
            'hardware_ids' => ['nullable', 'array'],
            'hardware_ids.*' => ['exists:hardwares,id'],
        ];
    }
}
