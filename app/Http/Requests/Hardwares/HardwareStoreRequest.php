<?php

namespace App\Http\Requests\Hardwares;

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
            'manufacturer_id' => ['required', 'int', 'exists:manufacturers,id'],
            'inventory_number' => ['nullable', 'string', 'unique:hardwares,inventory_number'],
            'serial_number' => ['nullable', 'string', 'unique:hardwares,serial_number'],
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }
}
