import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Machines\MachineCloneController::index
* @see app/Http/Controllers/Machines/MachineCloneController.php:23
* @route '/machine-clone'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/machine-clone',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::index
* @see app/Http/Controllers/Machines/MachineCloneController.php:23
* @route '/machine-clone'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::index
* @see app/Http/Controllers/Machines/MachineCloneController.php:23
* @route '/machine-clone'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::index
* @see app/Http/Controllers/Machines/MachineCloneController.php:23
* @route '/machine-clone'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::index
* @see app/Http/Controllers/Machines/MachineCloneController.php:23
* @route '/machine-clone'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::index
* @see app/Http/Controllers/Machines/MachineCloneController.php:23
* @route '/machine-clone'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::index
* @see app/Http/Controllers/Machines/MachineCloneController.php:23
* @route '/machine-clone'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::store
* @see app/Http/Controllers/Machines/MachineCloneController.php:37
* @route '/machine-clone/{machine}'
*/
export const store = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/machine-clone/{machine}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::store
* @see app/Http/Controllers/Machines/MachineCloneController.php:37
* @route '/machine-clone/{machine}'
*/
store.url = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machine: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { machine: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            machine: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        machine: typeof args.machine === 'object'
        ? args.machine.id
        : args.machine,
    }

    return store.definition.url
            .replace('{machine}', parsedArgs.machine.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::store
* @see app/Http/Controllers/Machines/MachineCloneController.php:37
* @route '/machine-clone/{machine}'
*/
store.post = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::store
* @see app/Http/Controllers/Machines/MachineCloneController.php:37
* @route '/machine-clone/{machine}'
*/
const storeForm = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Machines\MachineCloneController::store
* @see app/Http/Controllers/Machines/MachineCloneController.php:37
* @route '/machine-clone/{machine}'
*/
storeForm.post = (args: { machine: number | { id: number } } | [machine: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const machineClone = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
}

export default machineClone