[![Build Status](https://travis-ci.org/Conductor/backbone.hoard.svg?branch=master)](https://travis-ci.org/Conductor/backbone.hoard)

backbone.hoard
--------------

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cmaher/backbone.hoard?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Configurable caching for Backbone. Hoard is designed to make it easy to avoid 
extraneous AJAX requests by caching responses and making sure only one request goes out for the same url, 
all while remaining highly configurable and customizable. [Read about the reasoning behind Backbone.Hoard to find out if it's right for you](http://www.conductor.com/nightlight/using-backbone-hoard-spare-server-sanity/).

[Read the most up-to-date docs on the website](http://cmaher.github.io/backbone.hoard/)

#Installing

Hoard is available on npm and bower as `backbone.hoard`.

```
npm install backbone.hoard

OR

bower install backbone.hoard
```

When using bower, `dist/backbone.hoard.js` should work for all environments.

#Example
```js
var cacheControl = new Backbone.Hoard.Control();
var MyModel = Backbone.Model.extend({
    url: function () {
        return '/my-models/' + this.id;
    },
    
    sync: cacheControl.getModelSync()
});

var model1 = new MyModel({ id: 1 });
var model2 = new MyModel({ id: 1 });

var fetches = [model1.fetch(), model2.fetch()];

Promise.all(fetches).then(function () {
    // model1 and model2 have the same attributes, returned from the endpoint
    // Only one ajax request has been made
    doStuff();
});
```

#Requirements

 - Backbone 1.0.0 - 1.1.2
 - underscore 1.4.4 - 1.7.0
 - An es6-compliant `Promise`
 
#API

The usage demonstrated in the example represents the common use case. 
That said, Hoard is about configuring caching behavior, and each component is open to customization.

##Control

The `Control` is the entry point for all Hoard behavior. 
It's primary purpose is to assemble a `Strategy` for each method accepted by Backbone.sync.

###new Control(options)

Creates a `Control` and overwrites the following default options, if provided

- storeClass: the type of `Store` to create and assign to `store`, passed to all strategies
- policyClass: the type of `Policy` to create and assign to `policy`, passed to all strategies
- createStrategyClass: the type of `Strategy` to create and assign to `createStrategy`, used when `sync` is called with method `create`
- readStrategyClass: the type of `Strategy` to create and assign to `readStrategy`, used when `sync` is called with method `read`
- updateStrategyClass: the type of `Strategy` to create and assign to `updateStrategy`, used when `sync` is called with method `update`
- deleteStrategyClass: the type of `Strategy` to create and assign to `deleteStrategy`, used when `sync` is called with method `delete`
- patchStrategyClass: the type of `Strategy` to create and assign to `patchStrategy`, used when `sync` is called with method `patch`

All options provided will be passed down to the constructors of the `store`, `policy`, and all strategies.

###Control#sync(method, model, options)

Delegates to a strategy determined by `method`. Calls `Strategy#execute` with the provided `model` and `options`.

Returns a `Promise` that resolves if the sync action is successful or rejects if it fails.

By default, Control#sync behaves differently depending on the `method` parameter, as follows:

* `read`
    * [Cache hit] If the given `model` has data in the cache
        * If the item is not expired, call options.success with the cached item
        * If the item is expired, remove the item from the cache, and proceed as a read [Cache Miss]
    * [Cache Miss] If the given `model` does not have data in the cache
        * On a success, store the result in the cache
        * On an error, remove the `model`'s item from the cache
        * While waiting for the result of the call to `Backbone.sync`, prevent subsequent requests to the same url 
        from being made. Update all models blocked in this way once the `sync` result is known.
* `create`, `update`, `patch`
    * Delegate to `Backbone.sync` and store the response in the cache
* `delete`
    * Remove the `model`'s item from the cache
    * Delegate to `Backbone.sync`
    
All interactions with the cache use the given `model`'s `url` property as th key, 
as resolved at time of the initial sync call

NOTE: If at any time there is not enough space in the cache to store the desired item, Hoard will remove all 
managed items from the cache and try again. This behavior is temporary and is targeted for improvment in future releases.

###Control#getModelSync

Returns a method that can be assigned `sync` on a `Backbone.Model` or a `Backbone.Collection`. 
The returned method has all of the same properties as the control's `sync` method.

##Policy

The `Policy` determines meta information about cached items.
The default implementation is bare-bones.

Consider:

* `recipes/time-sensitive-policy` for a policy featuring time-based eviction.
* `recipes/jquery-data-params-policy` for a policy knowledgeable about jQuery data params on read

###Policy#getUrl(model, options, options)

Returns an identifier for the given `model` and `method` to reference in the cache.
Defaults to the result of `model.url`.

###Policy#getKey(model, method, options)

Returns an identifier for the given `model` and `method` to reference in the cache.
Defaults to Policy#getUrl.

###Policy#getData(model, options)

Return the database representation of the model. Defaults to `model.toJSON()`.

###Policy#getCollection(model, options)

Return the collection associated with the model, if any. Defaults to `model.collection`.

###Policy#areModelsSame(model, otherModel)

Return true if two models should be considered the same. Return false otherwise.
`model` and `otherModel` are provided as their attribute objects.
Defaults to returning true if the models have the same id.

###Policy#findSameModel(collection, model)

Look through `collection` for a model equivalent to `model`, and return that found model.
Delegate to `Policy#areModelsSame` for model comparison.
`collection` is provided as an array of objects. `model` is provided as an object.

###Policy#shouldEvictItem(metadata)

Returns `true` if the item represented by `metadata` is stale, false otherwise.

###Policy#getKeysToEvict(metadata, key, value, error)

Returns an array of keys to evict from cache if the cache is full. Defaults to returning all keys in the cache.

###Policy#getMetadata(key, response, options)

Returns an object representing the metadata for the given `key`, `response`, and `options`.

Returns an empty object by default.
This behavior is agnostic of any arguments provided, which are available for custom implementations.
See `recipe/time-sensitive-policy` for an example of using metadata for cache expiration

##Strategy

The `Strategy` uses the `Store` and `Policy` to determines how to handle any given call to `sync`. It is responsible for
determining when to read from the cache or from the server, when to write to the cache, 
and when to remove items from the cache.

###Strategy#execute(model, options)

Determines how to handle a `sync` for the given `model`. The bulk of caching behavior is handled by various 
implementations of this method in different subclasses of `Strategy`

Returns a `Promise` that resolves if the sync action is successful or rejects if it fails.

##Store

The `Store` encapsulates all interaction with the backing persistence API. 
Even though the default implementation uses an api similar to `localStorage` for persistence,
all interactions with `Store` are asynchronous. 
This behavior makes it possible to use other types of client-side storage, such as IndexedDB or WebSQL

###Store#get(key, [options])

Returns a `Promise` that resolves with the cached item associated with the given `key` if it exists, 
or a rejected `Promise` if the item is not in the cache.

`options` are provided for use by custom implementations.

###Store#set(key, item, meta, [options])

Store the given `item` in the cache under the given `key`. 
Additionally, store the provided `metadata` containing information that Hoard needs to manage the cached item.

Returns a `Promise` that resolves when the given item and metadata are stored
or rejects if an error occurs when storing either value.

`options` are provided for use by custom implementations.

###Store#invalidate(key, [options])

Remove the item and metadata associated with the given `key` from the cache.

Returns a `Promise` that resolves when the item is removed from the cache.

`options` are provided for use by custom implementations.

###Store#getMetadata(key, [options])

Returns a `Promise` that resolves with either the metadata associated with the given `key` 
or an empty object if no metadata is found.

`options` are provided for use by custom implementations.

#Configuration

Hoard uses reasonable defaults for it's external dependencies, but they can be configured, if desired.

##Hoard.Promise

Hoard will use the native Promise (`window.Promise`) implementation, if it exists. 
Otherwise, you will need to configure Hoard with an es6-compliant Promise implementation.
 
##Hoard.backend

By default, Hoard will use an in-memory store to cache data and metadata.
Using an in-memory store ensures that the cache will never be stale on a page refresh.
If persistence beyond page refreshes is desired, `Hoard.backend` can also be set to
`localStorage`, `sessionStorage`, or anything matching a `localStorage` API supporting:

 - `backend.setItem`
 - `backend.getItem`
 - `backend.removeItem`
 
 ```js
 // ex: using localStorage instead of the in-memory store
 // Make Stores use localStorage unless explicitly told to use something else
 Hoard.backend = localStorage;
 
 // Make all instantces of SessionStore use SessionStorage
 var SessionStore = Hoard.Store.extend({ backend: sessionStorage });

 // Using mozilla/localForage
 localforage.setDriver(localforage.INDEXEDDB);
 var LocalForageStore = Hoard.Store.extend({ backend: localforage });
 ```
