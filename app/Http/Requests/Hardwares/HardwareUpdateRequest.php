<?php

namespace App\Http\Requests\Hardwares;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HardwareUpdateRequest extends FormRequest
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
        $hardwareId = $this->route('hardware')->id;

        return [
            'category_id' => ['required', 'int', 'exists:hardware_categories,id'],
            'status_id' => $this->statusRules(),
            'manufacturer_id' => ['required', 'int', 'exists:manufacturers,id'],
            'inventory_number' => ['nullable', 'string', "unique:hardwares,inventory_number,{$hardwareId}"],
            'serial_number' => ['nullable', 'string', "unique:hardwares,serial_number,{$hardwareId}"],
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }

    private function statusRules(): array
    {
        return [
            'required',
            'int',
            Rule::exists('hardware_status', 'id')->where(fn ($query) => $query->where('only_system', false)),
        ];
    }
}
