# Using jsonApiRoute framework

[`jsonApiRoute()`][json-api-route] is an abstraction layer for [Next.js API Routes][njs-api-route] that is both a middleware framework, and [JSON:API][] document builder.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Basic Usage](#basic-usage)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
  - [APIError](#apierror)
- [Context](#context)
  - [`context.req`](#contextreq)
  - [`context.res`](#contextres)
  - [`context.state`](#contextstate)
  - [`context.data`](#contextdata)
  - [`context.included`](#contextincluded)
  - [`context.errors`](#contexterrors)
  - [`context.meta`](#contextmeta)
  - [`context.status(code)`](#contextstatuscode)
  - [`context.send(data)`](#contextsenddata)
  - [`context.include(data)`](#contextincludedata)
  - [`context.error(error[, first])`](#contexterrorerror-first)
  - [`context.createResource(data)`](#contextcreateresourcedata)
- [Request](#request)
  - [`request.query`](#requestquery)
  - [`request.cookies`](#requestcookies)
  - [`request.body`](#requestbody)
  - [`request.preview`](#requestpreview)
  - [`request.previewData`](#requestpreviewdata)
  - [`request.ips`](#requestips)
  - [`request.ip`](#requestip)
  - [`request.fingerprint`](#requestfingerprint)
  - [`request.getHeader(name)`](#requestgetheadername)
- [Response](#response)
  - [`response.send(body)`](#responsesendbody)
  - [`response.json(body)`](#responsejsonbody)
  - [`response.status(code)`](#responsestatuscode)
  - [`response.setPreviewData(data[, options])`](#responsesetpreviewdatadata-options)
  - [`response.clearPreviewData()`](#responseclearpreviewdata)
  - [`response.redirect([status,] path)`](#responseredirectstatus-path)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->





## Basic Usage

``` js
// /pages/api/hello-world.js
export default jsonApiRoute((ctx) => {
  ctx.send({
    id: '123456',
    type: 'hello-world'
    attributes: {
      hello: 'world!'
    }
  })
})
```

```JSON
// GET /api/hello-world
{
  "data": {
    "id": "123456",
    "type": "hello-world",
    "attributes": {
      "hello": "world!"
    }
  },
  "included": [],
  "meta": {},
  "jsonapi": {
    "version": '1.0',
  },
}
```





## Middleware

Middleware follow Koa.js' model of async middleware. Since this framework is built on top of `koa-compose`, the same basic concepts of control flow apply. More information can be found [here][koa-cascading].

For a basic example, lets build a middleware which gets the user object for a given authorization key

``` js
import getUser from 'magic-example-package'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'
import { UnauthorizedAPIError } from '~/util/server/errors'


// It's recommended to use a generator function like this even if you don't require configuration.
// This way all middleware are consistent, and adding configuration in the future does not have to be a breaking change.
async function requireUser () {
  return (ctx, next) => {
    const user = await getUser(Request.getHeader('Authorization')) // Gets the user matching the given auth token.

    if (!user) {
      // We throw here to immediately break the chain and have the route framework respond with the error.
      // If we wanted to continue execution, we could send this error to ctx.error(error) instead of throwing.
      throw new UnauthorizedAPIError()
    }

    ctx.state.user = user // Add the user object to state. Note that this does NOT mean it will be sent with the response.

    await next() // wait for the other middleware deeper in the chain.

    if (ctx.state.includeUser) {
      // If the endpoint requests it, include, the user object to the response.
      ctx.include(user)
    }
  }
}

export default jsonApiRoute(
  requireUser(),
  (ctx) => {
    /* Do some work */
    ctx.state.includeUser = true
    ctx.send(/* some data */)
  }
)
```





## Error Handling

There are two methods of responding with an error.
The primary method, `throw new Error()`, will immediately halt execution of the endpoint and will be caught by the top level middleware.
Calling `ctx.error(new Error())` is a secondary option which will **NOT** halt execution, but the error will be included when another error is thrown or the endpoint is resolved.

Both methods treat errors in the same way.
**Any** error which does not extend `APIError` will be wrapped by `InternalServerAPIError`, with the original error assigned to the `internalError` property of the `meta` field.
Errors which _do_ extend `APIError` will be appended to the response as-is.


### APIError

`APIError` is an extension of `Error` which is serialized to a [JSON:API][] compliant [error object](https://jsonapi.org/format/#error-objects).
There are a number of standard errors available in the main `errors.js` util module which **SHOULD** be used when possible.





## Context

The context object is a single object which contains:
* The request's `req` and `res` objects,
* The top level elements of a [JSON:API][] response document,
* and helper functions to simplify forming a response.

### `context.req`

A modified instance of [`http.IncomingMessage`][http-incoming-message]. This has been extended with various utilities by both Next.js and this framework.

Read more about the Request object [below](#request)


### `context.res`

A modified instance of [`http.ServerResponse`][http-server-response] provided by Next.js.

Since the response of a request is handled by `jsonApiRoute()`, there is usually no need for endpoints to interface with `ctx.res` directly.
Nevertheless it is available here for reference.

Read more about the Response object [below](#response)


### `context.state`

* {object}

A namespace provided for passing information though middleware and your routes.


### `context.data`

* {Resource|Resource[]} read-only resource or collection of resources.

The response document's `data` field.

Use [`context.send(data)`](#contextsenddata) to modify this field


### `context.included`

* {`Resource[]`} read-only collection of JSON:API compliant resource objects.

The response document's `included` field.

Use [`context.include(data)`](#contextincludedata) to append to includes.


### `context.errors`

* {APIError[]}

A read-only collection of errors attached to the response, but not not neccessarily thrown.

Use [`context.error(error[], first])`](#contexterrorerror-first) to append to errors.


### `context.meta`

* {object}

The response document's `meta` field. This field is freely editable.

### `context.status(code)`
* `code` {number} Numerical HTTP status code
* **Returns:** {Context}

Alias for [`Response.status(code)`][#responsestatuscode]. Manually sets the response status code.
`status()` cannot override an error code. To force a specific error, use [`context.error(error, true)`](#contexterrorerror-first), or throw an instance of `APIError`.


### `context.send(data)`
* `data` {object}
    * **MUST** be JSON:API compliant resource object.
    * All unknown top-level properties will be made a property of `attributes`.
    * An array of resources **MUST** share the same `type` value.
* **Returns:** {Context}

Sets a resource or collection of resources to the response document's primary `data` field.


### `context.include(data)`
* `data` {object|object[]}
    * **MUST** be JSON:API compliant resource object.
    * All unknown top-level properties will be made a property of `attributes`.
* **Returns:** {Context}

Appends a resource or collection of resources to the response document's `included` field.


### `context.error(error[, first])`
* `error` {APIError|Error} Any instance of `Error`.
    * Preferably an error extending `APIError`
    * Errors not extending `APIError` will be wrapped by `InternalServerAPIError` with the message of the error included in it's `meta` property.
* `first` {boolean} Optional boolean to determine if the error should be forcefully added to the top of the error stack.
* **Returns:** {Context}

Appends an error to the response document's `errors` field. Adding an error will also prevent `data` and `included` from being sent as per [JSON:API][] spec.
Useful for including additional errors before throwing the primary error preventing a successful response. Calling this method will **NOT** halt endpoint execution.

### `context.createResource(data)`
* `data` {object} **Any** object containing at least an `id` and `type` property.
* **Returns:** {Resource}

Convenience function to transform an object into a valid [JSON:API][] Resource object.
This function is used by [`context.send(data)`](#contextsenddata) and [`context.include(data)`](#contextincludedata) to process data and ensure spec compliance.

All unknown top-level properties of the provided object will be made a property of `attributes`.

Known top-level properties include `id`, `type`, `attributes`, `relationships`, `links`, and `meta`.





## Request

The request object (`context.req`) is an extension of the [`http.IncomingMessage`][http-incoming-message] object. The following additional properties are available:

### `request.query`
* {object}

Object of parsed `query` values from URL. Values may be `string` or `string[]`.

### `request.cookies`
* {object}

Object of parsed cookies from headers. Values will be `string`.

### `request.body`
* {any}

Parsed body data of the request

### `request.preview`
* {Boolean}

Boolean representing if Next.js [preview mode](https://nextjs.org/docs/advanced-features/preview-mode) is enabled or not

### `request.previewData`
* {Object}

Preview mode data for the request.

### `request.ips`
* {string[]}

Parsed list of `X-Forwarded-For` entries. Only populated if `process.env.APP_PROXIED` is `true`

### `request.ip`
* {string}

Public IP of the remote client making the request.

### `request.fingerprint`
* {string}

Fingerprint value sent with the request via the `X-Fingerprint` header.

### `request.getHeader(name)`
* `name` {string} case-insensitive name of a request header.
* **Returns:** {string|undefined}

Convenience function to retrieve a request header.





## Response

The response object (`context.res`) is an extension of the [`http.ServerResponse`][http-server-response] object. The following additional properties are available:


### `response.send(body)`
> DISCOURAGED. Use [`context.send(data)`](#contextsenddata) instead.

* `body` {string|object|Buffer}

Sends the HTTP response. Infers `Content-Type` from body.


### `response.json(body)`
> DISCOURAGED. Use [`context.send(data)`](#contextsenddata) instead.

* `body` {object} Serializable JSON data

Sends a JSON Response. Automatically sets `Content-Type` header to `application/json`.


### `response.status(code)`
> DISCOURAGED. Use [`context.status(code)`](#contextstatuscode) instead.

* `code` {number} Numerical HTTP status code
**Returns:** {Response}

Sets [`response.statusCode`](https://nodejs.org/dist/latest/docs/api/http.html#http_response_statuscode) to the provided status code.


### `response.setPreviewData(data[, options])`
* `data` {object|string}
* `options` {object}
* **Returns:** {Response}

See [Next.js Docs][njs-preview-mode]


### `response.clearPreviewData()`
* **Returns:** {Response}

See [Next.js Docs][njs-clear-preview-data]


### `response.redirect([status,] path)`
* `status` {number} a valid HTTP status code. (**Default:** `307`)
* `path` {string} Path or URL to redirect to.
* **Returns:** {Response}

Redirects to a specified path or URL.



[JSON:API]: https://jsonapi.org/format/
[json-api-route]: ../src/util/server/middleware/jsonApiRoute.js
[njs-api-route]: https://nextjs.org/docs/api-routes/introduction
[njs-req-helpers]: https://nextjs.org/docs/api-routes/api-middlewares
[njs-preview-mode]: https://nextjs.org/docs/advanced-features/preview-mode
[njs-clear-preview-data]: https://nextjs.org/docs/advanced-features/preview-mode#clear-the-preview-mode-cookies
[koa-cascading]: https://koajs.com/#cascading
[http-incoming-message]: https://nodejs.org/api/http.html#http_class_http_incomingmessage
[http-server-response]: https://nodejs.org/api/http.html#http_class_http_serverresponse
