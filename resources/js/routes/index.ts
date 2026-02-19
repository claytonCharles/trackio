import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see routes/web.php:7
* @route '/'
*/
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:7
* @route '/'
*/
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see routes/web.php:7
* @route '/'
*/
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:7
* @route '/'
*/
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see routes/web.php:7
* @route '/'
*/
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:7
* @route '/'
*/
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:7
* @route '/'
*/
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

home.form = homeForm

/**
* @see routes/web.php:11
* @route '/exemple'
*/
export const exemple = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exemple.url(options),
    method: 'get',
})

exemple.definition = {
    methods: ["get","head"],
    url: '/exemple',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:11
* @route '/exemple'
*/
exemple.url = (options?: RouteQueryOptions) => {
    return exemple.definition.url + queryParams(options)
}

/**
* @see routes/web.php:11
* @route '/exemple'
*/
exemple.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exemple.url(options),
    method: 'get',
})

/**
* @see routes/web.php:11
* @route '/exemple'
*/
exemple.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exemple.url(options),
    method: 'head',
})

/**
* @see routes/web.php:11
* @route '/exemple'
*/
const exempleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exemple.url(options),
    method: 'get',
})

/**
* @see routes/web.php:11
* @route '/exemple'
*/
exempleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exemple.url(options),
    method: 'get',
})

/**
* @see routes/web.php:11
* @route '/exemple'
*/
exempleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exemple.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exemple.form = exempleForm
