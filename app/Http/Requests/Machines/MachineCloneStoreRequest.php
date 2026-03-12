<?php

namespace App\Http\Requests\Machines;

use Illuminate\Foundation\Http\FormRequest;

class MachineCloneStoreRequest extends FormRequest
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
        $max = config('machines.clone_max_copies', 200);

        return [
            'copies' => ['required', 'integer', 'min:1', "max:{$max}"],
        ];
    }

    public function messages(): array
    {
        $max = config('machines.clone_max_copies', 200);

        return [
            'copies.max' => "O número máximo de cópias permitido é {$max}.",
        ];
    }
}
