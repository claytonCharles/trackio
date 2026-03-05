import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Hardwares\HardwareController::index
* @see app/Http/Controllers/Hardwares/HardwareController.php:30
* @route '/hardwares'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hardwares',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::index
* @see app/Http/Controllers/Hardwares/HardwareController.php:30
* @route '/hardwares'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::index
* @see app/Http/Controllers/Hardwares/HardwareController.php:30
* @route '/hardwares'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::index
* @see app/Http/Controllers/Hardwares/HardwareController.php:30
* @route '/hardwares'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::index
* @see app/Http/Controllers/Hardwares/HardwareController.php:30
* @route '/hardwares'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::index
* @see app/Http/Controllers/Hardwares/HardwareController.php:30
* @route '/hardwares'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::index
* @see app/Http/Controllers/Hardwares/HardwareController.php:30
* @route '/hardwares'
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
* @see \App\Http\Controllers\Hardwares\HardwareController::create
* @see app/Http/Controllers/Hardwares/HardwareController.php:44
* @route '/hardwares/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hardwares/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::create
* @see app/Http/Controllers/Hardwares/HardwareController.php:44
* @route '/hardwares/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::create
* @see app/Http/Controllers/Hardwares/HardwareController.php:44
* @route '/hardwares/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::create
* @see app/Http/Controllers/Hardwares/HardwareController.php:44
* @route '/hardwares/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::create
* @see app/Http/Controllers/Hardwares/HardwareController.php:44
* @route '/hardwares/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::create
* @see app/Http/Controllers/Hardwares/HardwareController.php:44
* @route '/hardwares/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::create
* @see app/Http/Controllers/Hardwares/HardwareController.php:44
* @route '/hardwares/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::store
* @see app/Http/Controllers/Hardwares/HardwareController.php:54
* @route '/hardwares'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hardwares',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::store
* @see app/Http/Controllers/Hardwares/HardwareController.php:54
* @route '/hardwares'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::store
* @see app/Http/Controllers/Hardwares/HardwareController.php:54
* @route '/hardwares'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::store
* @see app/Http/Controllers/Hardwares/HardwareController.php:54
* @route '/hardwares'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::store
* @see app/Http/Controllers/Hardwares/HardwareController.php:54
* @route '/hardwares'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::show
* @see app/Http/Controllers/Hardwares/HardwareController.php:68
* @route '/hardwares/{hardware}'
*/
export const show = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hardwares/{hardware}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::show
* @see app/Http/Controllers/Hardwares/HardwareController.php:68
* @route '/hardwares/{hardware}'
*/
show.url = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hardware: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { hardware: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            hardware: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        hardware: typeof args.hardware === 'object'
        ? args.hardware.id
        : args.hardware,
    }

    return show.definition.url
            .replace('{hardware}', parsedArgs.hardware.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::show
* @see app/Http/Controllers/Hardwares/HardwareController.php:68
* @route '/hardwares/{hardware}'
*/
show.get = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::show
* @see app/Http/Controllers/Hardwares/HardwareController.php:68
* @route '/hardwares/{hardware}'
*/
show.head = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::show
* @see app/Http/Controllers/Hardwares/HardwareController.php:68
* @route '/hardwares/{hardware}'
*/
const showForm = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::show
* @see app/Http/Controllers/Hardwares/HardwareController.php:68
* @route '/hardwares/{hardware}'
*/
showForm.get = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::show
* @see app/Http/Controllers/Hardwares/HardwareController.php:68
* @route '/hardwares/{hardware}'
*/
showForm.head = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::edit
* @see app/Http/Controllers/Hardwares/HardwareController.php:83
* @route '/hardwares/{hardware}/edit'
*/
export const edit = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/hardwares/{hardware}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::edit
* @see app/Http/Controllers/Hardwares/HardwareController.php:83
* @route '/hardwares/{hardware}/edit'
*/
edit.url = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hardware: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { hardware: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            hardware: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        hardware: typeof args.hardware === 'object'
        ? args.hardware.id
        : args.hardware,
    }

    return edit.definition.url
            .replace('{hardware}', parsedArgs.hardware.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::edit
* @see app/Http/Controllers/Hardwares/HardwareController.php:83
* @route '/hardwares/{hardware}/edit'
*/
edit.get = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::edit
* @see app/Http/Controllers/Hardwares/HardwareController.php:83
* @route '/hardwares/{hardware}/edit'
*/
edit.head = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::edit
* @see app/Http/Controllers/Hardwares/HardwareController.php:83
* @route '/hardwares/{hardware}/edit'
*/
const editForm = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::edit
* @see app/Http/Controllers/Hardwares/HardwareController.php:83
* @route '/hardwares/{hardware}/edit'
*/
editForm.get = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::edit
* @see app/Http/Controllers/Hardwares/HardwareController.php:83
* @route '/hardwares/{hardware}/edit'
*/
editForm.head = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::update
* @see app/Http/Controllers/Hardwares/HardwareController.php:101
* @route '/hardwares/{hardware}'
*/
export const update = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/hardwares/{hardware}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::update
* @see app/Http/Controllers/Hardwares/HardwareController.php:101
* @route '/hardwares/{hardware}'
*/
update.url = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hardware: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { hardware: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            hardware: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        hardware: typeof args.hardware === 'object'
        ? args.hardware.id
        : args.hardware,
    }

    return update.definition.url
            .replace('{hardware}', parsedArgs.hardware.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::update
* @see app/Http/Controllers/Hardwares/HardwareController.php:101
* @route '/hardwares/{hardware}'
*/
update.put = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::update
* @see app/Http/Controllers/Hardwares/HardwareController.php:101
* @route '/hardwares/{hardware}'
*/
update.patch = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::update
* @see app/Http/Controllers/Hardwares/HardwareController.php:101
* @route '/hardwares/{hardware}'
*/
const updateForm = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::update
* @see app/Http/Controllers/Hardwares/HardwareController.php:101
* @route '/hardwares/{hardware}'
*/
updateForm.put = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::update
* @see app/Http/Controllers/Hardwares/HardwareController.php:101
* @route '/hardwares/{hardware}'
*/
updateForm.patch = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::destroy
* @see app/Http/Controllers/Hardwares/HardwareController.php:121
* @route '/hardwares/{hardware}'
*/
export const destroy = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hardwares/{hardware}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::destroy
* @see app/Http/Controllers/Hardwares/HardwareController.php:121
* @route '/hardwares/{hardware}'
*/
destroy.url = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hardware: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { hardware: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            hardware: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        hardware: typeof args.hardware === 'object'
        ? args.hardware.id
        : args.hardware,
    }

    return destroy.definition.url
            .replace('{hardware}', parsedArgs.hardware.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::destroy
* @see app/Http/Controllers/Hardwares/HardwareController.php:121
* @route '/hardwares/{hardware}'
*/
destroy.delete = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::destroy
* @see app/Http/Controllers/Hardwares/HardwareController.php:121
* @route '/hardwares/{hardware}'
*/
const destroyForm = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hardwares\HardwareController::destroy
* @see app/Http/Controllers/Hardwares/HardwareController.php:121
* @route '/hardwares/{hardware}'
*/
destroyForm.delete = (args: { hardware: number | { id: number } } | [hardware: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const hardwares = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default hardwares