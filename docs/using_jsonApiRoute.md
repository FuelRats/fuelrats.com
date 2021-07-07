# Using jsonApiRoute framework

[`jsonApiRoute()`][json-api-route] is an abstraction layer for [Next.js API Routes][njs-api-route] that is both a middleware framework, and [JSON:API][json-api] document builder.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Basic Usage](#basic-usage)
- [Middleware](#middleware)
- [Context](#context)
  - [`context.req`](#contextreq)
  - [`context.res`](#contextres)
  - [`context.state`](#contextstate)
  - [`context.data`](#contextdata)
  - [`context.included`](#contextincluded)
  - [`context.errors`](#contexterrors)
  - [`context.meta`](#contextmeta)
  - [`context.send`](#contextsend)
  - [`context.error`](#contexterror)
  - [`context.include`](#contextinclude)

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
    const user = await getUser(ctx.req.getHeader('Authorization')) // Gets the user matching the given auth token.

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





## Context

The context object is a single object which contains:
* The Next.js API Route `req` and `res` objects,
* The top level elements of a [JSON:API][json-api] response document,
* and helper functions to simplify forming a response.

### `context.req`

The instance of [`http.IncomingMessage`][http-incoming-message] sent by Next.js, which also includes some [additional functions](#jsonapirouterequest)



### `context.res`

the instance of [`http.ServerResponse`][http-server-response] provided by Next.js.

Manually sending the response with this framework is **NOT** supported. This should normally be used as a read-only reference.



### `context.state`

A namespace provided for passing information though middleware and your routes.



### `context.data`

`READ-ONLY`

The response document's `data` field.

Use [`context.send`](#contextsend) to modify this field



### `context.included`

`READ-ONLY`

The response document's `included` field.

Use [`context.include`](#contextinclude) to append to includes.



### `context.errors`

`READ-ONLY`

A collection of errors attached to the response, but not not neccessarily thrown.

Use [`context.error`](#contexterror) to append to errors.

Use [`context.error`] to append errors.



### `context.meta`

The response document's `meta` field. This field is freely editable.



### `context.send`

Sets a resource or array of resources to the response document's primary `data` field.

TODO

### `context.error`

Adds an error to the response document's `errors` field. Adding an error will also prevent `data` and `included` from being sent as per JSON:API spec.

TODO

### `context.include`

Adds a resource object to the response document's `included` field.

TODO


## `jsonApiRoute()` Request

TODO

## `jsonApiRoute()` Response

TODO










[json-api]: https://jsonapi.org/format/
[json-api-route]: ../src/util/server/middleware/jsonApiRoute.js
[njs-api-route]: https://nextjs.org/docs/api-routes/introduction
[njs-req-helpers]: https://nextjs.org/docs/api-routes/api-middlewares
[koa-cascading]: https://koajs.com/#cascading
[http-incoming-message]: https://nodejs.org/api/http.html#http_class_http_incomingmessage
[http-server-response]: https://nodejs.org/api/http.html#http_class_http_serverresponse
