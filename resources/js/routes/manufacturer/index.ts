import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::store
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:24
* @route '/manufacturer'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/manufacturer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::store
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:24
* @route '/manufacturer'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::store
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:24
* @route '/manufacturer'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::store
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:24
* @route '/manufacturer'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::store
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:24
* @route '/manufacturer'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::update
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:38
* @route '/manufacturer/{manufacturer}'
*/
export const update = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/manufacturer/{manufacturer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::update
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:38
* @route '/manufacturer/{manufacturer}'
*/
update.url = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { manufacturer: args }
    }

    if (Array.isArray(args)) {
        args = {
            manufacturer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        manufacturer: args.manufacturer,
    }

    return update.definition.url
            .replace('{manufacturer}', parsedArgs.manufacturer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::update
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:38
* @route '/manufacturer/{manufacturer}'
*/
update.put = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::update
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:38
* @route '/manufacturer/{manufacturer}'
*/
update.patch = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::update
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:38
* @route '/manufacturer/{manufacturer}'
*/
const updateForm = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::update
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:38
* @route '/manufacturer/{manufacturer}'
*/
updateForm.put = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::update
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:38
* @route '/manufacturer/{manufacturer}'
*/
updateForm.patch = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Manufacturers\ManufactureController::destroy
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:53
* @route '/manufacturer/{manufacturer}'
*/
export const destroy = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/manufacturer/{manufacturer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::destroy
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:53
* @route '/manufacturer/{manufacturer}'
*/
destroy.url = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { manufacturer: args }
    }

    if (Array.isArray(args)) {
        args = {
            manufacturer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        manufacturer: args.manufacturer,
    }

    return destroy.definition.url
            .replace('{manufacturer}', parsedArgs.manufacturer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::destroy
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:53
* @route '/manufacturer/{manufacturer}'
*/
destroy.delete = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::destroy
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:53
* @route '/manufacturer/{manufacturer}'
*/
const destroyForm = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Manufacturers\ManufactureController::destroy
* @see app/Http/Controllers/Manufacturers/ManufactureController.php:53
* @route '/manufacturer/{manufacturer}'
*/
destroyForm.delete = (args: { manufacturer: string | number } | [manufacturer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const manufacturer = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default manufacturer