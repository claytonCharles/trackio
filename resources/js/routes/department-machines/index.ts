import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::index
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:24
* @route '/departments/{department}/machines'
*/
export const index = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/departments/{department}/machines',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::index
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:24
* @route '/departments/{department}/machines'
*/
index.url = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: args.department,
    }

    return index.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::index
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:24
* @route '/departments/{department}/machines'
*/
index.get = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::index
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:24
* @route '/departments/{department}/machines'
*/
index.head = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::index
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:24
* @route '/departments/{department}/machines'
*/
const indexForm = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::index
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:24
* @route '/departments/{department}/machines'
*/
indexForm.get = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::index
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:24
* @route '/departments/{department}/machines'
*/
indexForm.head = (args: { department: string | number } | [department: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::store
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:35
* @route '/departments/{department}/machines'
*/
export const store = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/departments/{department}/machines',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::store
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:35
* @route '/departments/{department}/machines'
*/
store.url = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { department: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: typeof args.department === 'object'
        ? args.department.id
        : args.department,
    }

    return store.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::store
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:35
* @route '/departments/{department}/machines'
*/
store.post = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::store
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:35
* @route '/departments/{department}/machines'
*/
const storeForm = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::store
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:35
* @route '/departments/{department}/machines'
*/
storeForm.post = (args: { department: number | { id: number } } | [department: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::destroy
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:50
* @route '/departments/{department}/machines/{machine}'
*/
export const destroy = (args: { department: number | { id: number }, machine: number | { id: number } } | [department: number | { id: number }, machine: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/departments/{department}/machines/{machine}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::destroy
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:50
* @route '/departments/{department}/machines/{machine}'
*/
destroy.url = (args: { department: number | { id: number }, machine: number | { id: number } } | [department: number | { id: number }, machine: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            department: args[0],
            machine: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: typeof args.department === 'object'
        ? args.department.id
        : args.department,
        machine: typeof args.machine === 'object'
        ? args.machine.id
        : args.machine,
    }

    return destroy.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace('{machine}', parsedArgs.machine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::destroy
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:50
* @route '/departments/{department}/machines/{machine}'
*/
destroy.delete = (args: { department: number | { id: number }, machine: number | { id: number } } | [department: number | { id: number }, machine: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::destroy
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:50
* @route '/departments/{department}/machines/{machine}'
*/
const destroyForm = (args: { department: number | { id: number }, machine: number | { id: number } } | [department: number | { id: number }, machine: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Departments\DepartmentMachineController::destroy
* @see app/Http/Controllers/Departments/DepartmentMachineController.php:50
* @route '/departments/{department}/machines/{machine}'
*/
destroyForm.delete = (args: { department: number | { id: number }, machine: number | { id: number } } | [department: number | { id: number }, machine: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const departmentMachines = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default departmentMachines