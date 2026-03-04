<?php

namespace App\Http\Requests\Hardwares;

use App\Models\Hardwares\Hardware;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HardwareStoreRequest extends FormRequest
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
            'category_id' => ['required', 'int', 'exists:hardware_categories,id'],
            'status_id' => ['required', 'int', 'exists:hardware_status,id'],
            'manufacturer_id' => ['required', 'int', 'exists:manufacturers,id'],
            'inventory_number' => ['nullable', 'string', Rule::unique(Hardware::class)],
            'serial_number' => ['nullable', 'string', Rule::unique(Hardware::class)],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
        ];
    }
}
