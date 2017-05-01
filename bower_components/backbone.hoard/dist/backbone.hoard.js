(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "underscore"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("backbone"), require("underscore")) : factory(root["Backbone"], root["_"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Backbone = __webpack_require__(1);
	var Hoard = __webpack_require__(2);
	Hoard.Store = __webpack_require__(3);
	Hoard.Policy = __webpack_require__(4);
	Hoard.Control = __webpack_require__(5);
	Hoard.Strategy = __webpack_require__(6);
	
	if (typeof Promise !== 'undefined') {
	  Hoard.Promise = Promise;
	}
	
	var previousHoard = Backbone.Hoard;
	Backbone.Hoard = Hoard;
	Hoard.noConflict = function () {
	  Backbone.Hoard = previousHoard;
	  return Hoard;
	};
	
	module.exports = Hoard;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Backbone = __webpack_require__(1);
	var Backend = __webpack_require__(8);
	
	var Hoard = {
	  VERSION: '0.4.0',
	
	  Promise: function () {
	    throw new TypeError('An ES6-compliant Promise implementation must be provided');
	  },
	
	  backend: new Backend(),
	
	  sync: Backbone.sync,
	
	  Events: Backbone.Events,
	
	  extend: Backbone.Model.extend,
	
	  _proxyExtend: function () {
	    return Hoard.extend.apply(this, arguments);
	  },
	
	  defer: function () {
	    var deferred = {};
	    deferred.promise = new this.Promise(function (resolve, reject) {
	      deferred.resolve = resolve;
	      deferred.reject = reject;
	    });
	    return deferred;
	  }
	};
	
	module.exports = Hoard;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	var Hoard = __webpack_require__(2);
	var MetaStore = __webpack_require__(14);
	var StoreHelpers = __webpack_require__(15);
	var Lock = __webpack_require__(16);
	
	var mergeOptions = ['backend', 'metaStoreClass'];
	
	// Adapt a common interface to a desired storage mechanism (e.g. localStorage, sessionStorage)
	// The interface is asynchronous, to support the use of asynchronous backends (e.g. IndexedDB)
	var Store = function (options) {
	  _.extend(this, _.pick(options || {}, mergeOptions));
	  _.defaults(this, {
	    backend: Hoard.backend,
	    metaStoreClass: MetaStore
	  });
	  this.metaStore = new this.metaStoreClass(options);
	  this.initialize.apply(this, arguments);
	};
	
	_.extend(Store.prototype, Hoard.Events, {
	  initialize: function () {},
	
	  // Store an item and its metadata
	  // If the store fails to set an item, invalidate the key
	  // and return an error message
	  set: function (key, item, meta, options) {
	    item = item || '';
	    meta = meta || '';
	    return Lock.withAccess('store-write', _.bind(function () {
	      var itemPromise = this.setItem(key, item);
	      var metaPromise = this.metaStore.set(key, meta, options);
	      return Hoard.Promise.all([itemPromise, metaPromise]);
	    }, this)).then(
	      _.identity,
	      _.bind(function (error) {
	        var errorHandler = function () {
	          return Hoard.Promise.reject(new Error({
	            key: key,
	            value: item,
	            meta: meta,
	            error: error,
	            options: options
	          }));
	        };
	        return this.invalidate(key, options)
	          .then(errorHandler, errorHandler);
	      }, this)
	    );
	  },
	
	  // Retrieve an item from the cache
	  // Returns a promise that resolves with the found cache item
	  // or rejects if an item is not found in the cache
	  get: function (key, options) {
	    return this.getItem.apply(this, arguments);
	  },
	
	  // Remove an item and its metadata from the cache
	  invalidate: function (key, options) {
	    var storePromise = this.removeItem(key, options);
	    var metaPromise = this.metaStore.invalidate(key, options);
	    return Hoard.Promise.all([storePromise, metaPromise]);
	  },
	
	  // Remove all items listed by store metadata then remove all metadata.
	  invalidateAll: function (options) {
	    var dataPromise = this.getAllMetadata(options).then(_.bind(function (metadata) {
	      var removals = _.map(_.keys(metadata), function (key) {
	        return this.removeItem(key, options);
	      }, this);
	
	      return Hoard.Promise.all(removals);
	    }, this));
	    var metaPromise = this.metaStore.invalidateAll(options);
	    return Hoard.Promise.all([dataPromise, metaPromise]);
	  },
	
	  // Get the metadata associated with the given key
	  getMetadata: function (key, options) {
	    return this.metaStore.get(key, options);
	  },
	
	  // Get all the metadata
	  getAllMetadata: function (options) {
	    return this.metaStore.getAll(options);
	  },
	
	  getItem: StoreHelpers.proxyGetItem,
	  setItem: StoreHelpers.proxySetItem,
	  removeItem: StoreHelpers.proxyRemoveItem
	});
	
	Store.extend = Hoard._proxyExtend;
	
	module.exports = Store;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	var Hoard = __webpack_require__(2);
	
	var mergeOptions = ['expires', 'timeToLive'];
	
	// A Policy determines key generation and cache eviction
	var Policy = function (options) {
	  _.extend(this, _.pick(options || {}, mergeOptions));
	  this.initialize.apply(this, arguments);
	};
	
	_.extend(Policy.prototype, Hoard.Events, {
	  initialize: function () {},
	
	  // Generate a key for the given model
	  // The key will be used to determine uniqueness in the store
	  getKey: function (model, method, options) {
	    return this.getUrl(model, method, options);
	  },
	
	  // Get the url for the given model
	  getUrl: function (model, method, options) {
	    return _.result(model, 'url');
	  },
	
	  // Get the data from the given model
	  getData: function (model, options) {
	    return model.toJSON();
	  },
	
	  // Get the collection associated with the model
	  getCollection: function (model, options) {
	    return model.collection;
	  },
	
	  // Do two models refer to the same resource?
	  // @param model: the raw model attributes
	  // @param otherModel: the raw model attributes
	  areModelsSame: function (model, otherModel) {
	    return model.id === otherModel.id;
	  },
	
	  // Find the same resource within a collection
	  // @param collection: the raw collection array
	  // @param model: the raw model attributes
	  findSameModel: function (collection, model) {
	    return _.find(collection, function (other) {
	      return this.areModelsSame(model, other);
	    }, this);
	  },
	
	  // Generate metadata
	  // Overwrite to return meaningful metadata
	  getMetadata: function (key, response, options) {
	    return {};
	  },
	
	  // Return true if the item associated with the given metadata should be evicted.
	  // Return false otherwise.
	  // Override if you want to use metaData to determine whether or not to evict the item
	  shouldEvictItem: function (meta) {
	    return false;
	  },
	
	  // Return an array of keys to evict
	  // By default, clear the world
	  getKeysToEvict: function (metadata, key, value, error) {
	    return _.keys(metadata);
	  }
	});
	
	Policy.extend = Hoard._proxyExtend;
	
	module.exports = Policy;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	
	var Hoard = __webpack_require__(2);
	var Store = __webpack_require__(3);
	var Policy = __webpack_require__(4);
	var CreateStrategyClass = __webpack_require__(9);
	var ReadStrategyClass = __webpack_require__(10);
	var UpdateStrategyClass = __webpack_require__(11);
	var PatchStrategyClass = __webpack_require__(12);
	var DeleteStrategyClass = __webpack_require__(13);
	
	// Configuration information to ease the creation of Strategy classes
	var strategies = {
	  create: {
	    klass: CreateStrategyClass,
	    classProperty: 'createStrategyClass',
	    property: 'createStrategy'
	  },
	
	  read: {
	    klass: ReadStrategyClass,
	    classProperty: 'readStrategyClass',
	    property: 'readStrategy'
	  },
	
	  update: {
	    klass: UpdateStrategyClass,
	    classProperty: 'updateStrategyClass',
	    property: 'updateStrategy'
	  },
	
	  patch: {
	    klass: PatchStrategyClass,
	    classProperty: 'patchStrategyClass',
	    property: 'patchStrategy'
	  },
	
	  'delete': {
	    klass: DeleteStrategyClass,
	    classProperty: 'deleteStrategyClass',
	    property: 'deleteStrategy'
	  }
	};
	
	var mergeOptions = _.union(['storeClass', 'policyClass'],
	  _.pluck(strategies, 'classProperty'));
	
	var strategyClasses = {};
	_.each(strategies, function (strategy) {
	  strategyClasses[strategy.classProperty] = strategy.klass;
	});
	
	// A Control is the entry point for caching behavior.
	// It serves as a means of grouping the configured Store, Policy, and Strategies,
	// all of which contain the main caching logic
	var Control = function (options) {
	  _.extend(this, _.pick(options || {}, mergeOptions));
	  var defaultClasses = _.extend({
	    storeClass: Store,
	    policyClass: Policy
	  }, strategyClasses);
	  _.defaults(this, defaultClasses);
	
	  // Create and assign a store and policy
	  this.store = new this.storeClass(options);
	  this.policy = new this.policyClass(options);
	
	  // For each sync method, create and assign a strategy to this Control
	  // Each strategy has access to this Control's store and policy
	  var strategyOptions = _.extend({}, options, {
	    store: this.store,
	    policy: this.policy
	  });
	  _.each(strategies, function (strategy) {
	    this[strategy.property] = new this[strategy.classProperty](strategyOptions);
	  }, this);
	
	  this.initialize.apply(this, arguments);
	};
	
	_.extend(Control.prototype, Hoard.Events, {
	  initialize: function () {},
	
	  // For the given sync method, execute the matching Strategy
	  sync: function (method, model, options) {
	    var strategyProperty = strategies[method].property;
	    var strategy = this[strategyProperty];
	    return strategy.execute(model, options);
	  },
	
	  // The main use of Hoard
	  // Return a sync method fully configured for the cache behavior of this Control
	  getModelSync: function () {
	    var modelSync = _.bind(this.sync, this);
	    modelSync.hoardControl = this;
	    return modelSync;
	  }
	});
	
	Control.extend = Hoard._proxyExtend;
	
	module.exports = Control;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	var Hoard = __webpack_require__(2);
	var Lock = __webpack_require__(16);
	
	var mergeOptions = ['store', 'policy'];
	
	// A Strategy is tied to a particular sync method on a Control
	// The execute method will be called by the Control with the model and options being synced.
	// It is abstract by default, and it's implementations get access to the Store and Policy
	// provided by the Controller
	var Strategy = function (options) {
	  _.extend(this, _.pick(options || {}, mergeOptions));
	  this.initialize.apply(this, arguments);
	};
	
	_.extend(Strategy.prototype, Hoard.Events, {
	  initialize: function () {},
	
	  // Set up some configuration, and pass control to this strategy's sync method
	  // Take care of all caching/server requesting.
	  // This is the main strategy method and entry point from Hoard.Control
	  execute: function (model, options) {
	    var hoardOptions = this.decorateOptions(model, options);
	    return this.sync(model, hoardOptions);
	  },
	
	  // If the model belongs to a collection and that collection is cached,
	  //   first try to read the model from the collection's cache
	  // Default to getting it from the model's cache
	  get: function (key, options) {
	    var updateCollection = this._getUpdateCollection(options);
	    var getFromCache = _.bind(this.store.get, this.store, key, options);
	    if (updateCollection) {
	      return updateCollection().then(
	        function (collection) {
	          var modelResponse = collection.policy.findSameModel(collection.raw, options.model);
	          return modelResponse ? modelResponse : getFromCache();
	        },
	        getFromCache
	      );
	    } else {
	      return getFromCache();
	    }
	  },
	
	  // If the model belongs to a collection and that collection is cached,
	  //   add the model to the collection's cache
	  // Default to setting the model the model's cache
	  set: function (key, value, meta, options) {
	    var updateCollection = this._getUpdateCollection(options);
	    var setToCache = _.bind(this.store.set, this.store, key, value, meta, options);
	    if (updateCollection) {
	      return updateCollection().then(
	        function (collection) {
	          var modelResponse = collection.policy.findSameModel(collection.raw, options.model);
	          if (!modelResponse) {
	            modelResponse = {};
	            collection.raw.push(modelResponse);
	          }
	          // clear the existing model and replace it with the response
	          _.each(_.keys(modelResponse), function (key) {
	            delete modelResponse[key];
	          });
	          _.extend(modelResponse, value);
	          meta = collection.control.policy.getMetadata(collection.key, collection.raw, options);
	          return collection.control.store.set(collection.key, collection.raw, meta, options);
	        },
	        setToCache
	      );
	    } else {
	      return setToCache();
	    }
	  },
	
	  // If the model belongs to a collection and that collection is cached,
	  //   remove the model from the collection's cache
	  // Default to removing the model the model's cache
	  invalidate: function (key, options) {
	    var updateCollection = this._getUpdateCollection(options);
	    var invalidateFromCache = _.bind(this.store.invalidate, this.store, key, options);
	    if (updateCollection) {
	      return updateCollection().then(
	        function (collection) {
	          var filteredCollection = _.reject(collection.raw, function (model) {
	            return collection.policy.areModelsSame(options.model, model);
	          });
	          var meta = collection.control.policy.getMetadata(collection.key, filteredCollection, options);
	          return collection.control.store.set(collection.key, filteredCollection, meta, options);
	        },
	        invalidateFromCache
	      );
	    } else {
	      return invalidateFromCache();
	    }
	  },
	
	  // Return a funtion that accesses the model's collection, if it exists
	  // Otherwise, return undefined, becasues the collection cannot be accessed
	  _getUpdateCollection: function (options) {
	    var collection = options && options.collection;
	    var collectionControl = collection && collection.sync && collection.sync.hoardControl;
	    if (collection && collectionControl) {
	      var collectionKey = collectionControl.policy.getKey(collection, options);
	      return _.bind(function () {
	        return this.store.get(collectionKey, options).then(function (rawCollection) {
	          return {
	            control: collectionControl,
	            policy: collectionControl.policy,
	            key: collectionKey,
	            raw: rawCollection
	          };
	        });
	      }, this);
	    }
	  },
	
	  //When the cache is full, evict items from the cache
	  //and try to store the item again
	  //or just return the value if storage fails
	  onCacheFull: function (cacheFull) {
	    var key = cacheFull.key;
	    var value = cacheFull.value;
	    var meta = cacheFull.meta;
	    var error = cacheFull.error;
	    var options = cacheFull.options;
	
	    // lock access to keep knowledge of cache consistent
	    return Lock.withLock('store-write', _.bind(function () {
	      return this.store.getAllMetadata().then(_.bind(function (metadata) {
	        var keysToEvict = this.policy.getKeysToEvict(metadata, key, value, error);
	        if (!_.isEmpty(keysToEvict)) {
	          var evictions = _.map(keysToEvict, function (key) {
	            return this.invalidate(key, options);
	          }, this);
	          return Hoard.Promise.all(evictions);
	        } else {
	          return Hoard.Promise.reject(new Error({
	            message: 'Could not clear memory',
	            error: error,
	            value: value
	          }));
	        }
	      }, this));
	    }, this)).then(
	      _.bind(this.set, this, key, value, meta, options),
	      function () {
	        return Hoard.Promise.reject(new Error({
	          value: value,
	          error: error
	        }));
	      }
	    );
	  },
	
	  // Override to edit the response
	  // Returns the same response by default
	  decorateResponse: function (response, options) {
	    return response;
	  },
	
	  decorateOptions: function (model, options) {
	    return _.extend({}, options, {
	      url: this.policy.getUrl(model, this.method, options),
	      collection: this.policy.getCollection(model, options),
	      model: model
	    });
	  },
	
	  // Cache the response when the success callback is called
	  _wrapSuccessWithCache: function (method, model, options) {
	    return this._wrapMethod(method, model, _.extend({
	      targetMethod: 'success',
	      responseHandler: _.bind(this._storeResponse, this)
	    }, options));
	  },
	
	  // invalidate the key when the success callback is called
	  _wrapErrorWithInvalidate: function (method, model, options) {
	    return this._wrapMethod(method, model, _.extend({
	      targetMethod: 'error',
	      responseHandler: _.bind(this._invalidateResponse, this)
	    }, options));
	  },
	
	  _wrapMethod: function (method, model, options) {
	    var key = this.policy.getKey(model, method, options);
	    return _.wrap(options[options.targetMethod], _.bind(function (targetMethod, response) {
	      if (targetMethod) {
	        targetMethod(response);
	      }
	      if (options.generateKeyFromResponse) {
	        key = this.policy.getKey(model, method, options);
	      }
	      if (options.responseHandler) {
	        options.responseHandler(key, response, options);
	      }
	    }, this));
	  },
	
	  _invalidateResponse: function (key, response, options) {
	    this.invalidate(key).then(
	      this._storeAction('onStoreSuccess', options, response),
	      this._storeAction('onStoreError', options, response)
	    );
	  },
	
	  _storeResponse: function (key, response, options) {
	    var meta = this.policy.getMetadata(key, response, options);
	    var finalResponse = this.decorateResponse(response, options);
	    this.set(key, finalResponse, meta, options).then(
	      _.identity,
	      _.bind(this.onCacheFull, this)
	    ).then(
	      this._storeAction('onStoreSuccess', options, response),
	      this._storeAction('onStoreError', options, response)
	    );
	  },
	
	  _storeAction: function (method, options, response) {
	    var callback = options[method] || function () { return response };
	    return function () {
	      return callback(response);
	    };
	  }
	});
	
	Strategy.extend = Hoard._proxyExtend;
	
	module.exports = Strategy;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	
	// Mimic the API of localStorage
	// All operations expect JSON strings to be stored and returned
	var Backend = function () {
	  this.clear();
	};
	
	_.extend(Backend.prototype, {
	  // around 5MB, matching common localStorage limit
	  maxSize: 5000000,
	
	  // Store the given value and update the size
	  setItem: function (key, value) {
	    if (this.size + value.length > this.maxSize) {
	      // Notify Hoard that the cache is full.
	      // This will trigger a cache invalidation.
	      throw new Error("On-Page Cache size exceeded");
	    } else {
	      this.storage[key] = value;
	      this.size += value.length;
	    }
	  },
	
	  // Get the item with the given key from the cache
	  // or null if the item is not found
	  getItem: function (key) {
	    var value = this.storage[key];
	    if (_.isUndefined(value)) {
	      value = null;
	    }
	    return value;
	  },
	
	  // Remove the item with the given key
	  // And update the size of the cache
	  removeItem: function (key) {
	    var value = this.getItem(key);
	    delete this.storage[key];
	    if (value != null) {
	      this.size -= value.length;
	    }
	    return value;
	  },
	
	  clear: function () {
	    this.storage = {};
	    this.size = 0;
	  }
	});
	
	module.exports = Backend;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var PositiveWriteStrategy = __webpack_require__(17);
	
	module.exports = PositiveWriteStrategy.extend({
	  method: 'create',
	
	  // In standard REST APIs, the id is not available until the response returns.
	  // Therefore, use the response when determining how to cache.
	  cacheOptions: function (model, options) {
	    return { generateKeyFromResponse: true };
	  }
	});


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	var Hoard = __webpack_require__(2);
	var Strategy = __webpack_require__(6);
	
	// The `Read` Strategy keeps a hash, `this.placeholders` of cache keys for which it is currently retrieving data.
	// Only one request, the 'live' request, for a given key will actually go through to retrieve the data from its source,
	// be it a cache hit (read from storage), or a cache miss (read from the server).
	// The remaining requests, the 'placeholder' requests', will receive the data once the live request responds.
	var Read = Strategy.extend({
	  method: 'read',
	
	  initialize: function (options) {
	    this.placeholders = {};
	  },
	
	  sync: function (model, options) {
	    var key = this.policy.getKey(model, this.method, options);
	
	    // If a placeholder is hit, then a request has already been made for this key
	    // Resolve when that request has returned
	    if (this.placeholders[key]) {
	      return this._onPlaceholderHit(key, options);
	    } else {
	      // If a placeholder is not found, then check the store for that key
	      // If the key is found in the store, treat that as a cache hit
	      // Otherwise, treat that as a cache miss
	      var executionPromise = this.get(key, options).then(
	        _.bind(this.onCacheHit, this, key, model, options),
	        _.bind(this.onCacheMiss, this, key, model, options)
	      );
	
	      // This is the first access, add a placeholder to signify that this key is in the process of being fetched
	      // `accesses` refers to the number of current live requests for this key
	      // `promise` will be resolved with the key's data if the retrieval is successful,
	      // or rejected with an error otherwise
	      this.placeholders[key] = {
	        accesses: 1,
	        promise: executionPromise
	      };
	
	      return executionPromise;
	    }
	  },
	
	  // On a cache hit, first check to see if the cached item should be evicted (e.g. the cache has expired).
	  // If the item should be evicted, do so, and proceed as a cache miss.
	  // Otherwise, remove this request from the placeholder access and resolve the promise with the cached item
	  onCacheHit: function (key, model, options, cachedItem) {
	    return this.store.getMetadata(key, options).then(_.bind(function (meta) {
	      if (this.policy.shouldEvictItem(meta)) {
	        return this.invalidate(key).then(_.bind(function () {
	          return this.onCacheMiss(key, model, options);
	        }, this));
	      } else {
	        this._decreasePlaceholderAccess(key);
	        if (options.success) {
	          options.success(cachedItem);
	        }
	        return cachedItem;
	      }
	    }, this));
	  },
	
	  // On a cache miss, fetch the data using `Hoard.sync` and cache it on success/invalidate on failure.
	  // Clears it's placeholder access only after storing or invalidating the response
	  onCacheMiss: function (key, model, options) {
	    var deferred = Hoard.defer();
	    var callback = _.bind(function (response) {
	      this._decreasePlaceholderAccess(key);
	      return deferred.resolve(response);
	    }, this);
	
	    var cacheOptions = _.extend({
	      onStoreSuccess: callback,
	      onStoreError: callback
	    }, options);
	    options.success = this._wrapSuccessWithCache(this.method, model, cacheOptions);
	    options.error = this._wrapErrorWithInvalidate(this.method, model, cacheOptions);
	
	    var syncResponse = Hoard.sync(this.method, model, options);
	    return deferred.promise.then(function () {
	      return syncResponse;
	    });
	  },
	
	  // On a placeholder hit, wait for the live request to go through,
	  // then resolve or reject with the response from the live request
	  _onPlaceholderHit: function (key, options) {
	    var deferred = Hoard.defer();
	    var callback = function (promiseHandler, originalHandler, response) {
	      if (originalHandler) { originalHandler(response); }
	      this._decreasePlaceholderAccess(key);
	      promiseHandler(response);
	    };
	    var onSuccess = _.bind(callback, this, deferred.resolve, options.success);
	    var onError = _.bind(callback, this, deferred.reject, options.error);
	
	    this.placeholders[key].accesses += 1;
	    this.placeholders[key].promise.then(onSuccess, onError);
	    return deferred.promise;
	  },
	
	  // A convenience method for decrementing the count for a placeholder
	  // and deleting the placeholder if nothing is currently accessing it
	  _decreasePlaceholderAccess: function (key) {
	    this.placeholders[key].accesses -= 1;
	    if (!this.placeholders[key].accesses) {
	      delete this.placeholders[key];
	    }
	  }
	});
	
	module.exports = Read;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var PositiveWriteStrategy = __webpack_require__(17);
	
	module.exports = PositiveWriteStrategy.extend({ method: 'update' });


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var PositiveWriteStrategy = __webpack_require__(17);
	var _ = __webpack_require__(7);
	
	module.exports = PositiveWriteStrategy.extend({
	  method: 'patch',
	
	  // A reasonable response for a PATCH call is to return the delta of the update.
	  // Provide the original information so the cached data makes sense
	  cacheOptions: function (model, options) {
	    return { original: this.policy.getData(model, options) };
	  },
	
	  decorateResponse: function (response, options) {
	    return _.extend({}, options.original, response);
	  }
	});


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Hoard = __webpack_require__(2);
	var Strategy = __webpack_require__(6);
	
	// The Delete Strategy aggressively clears a cached item
	var Delete = Strategy.extend({
	  method: 'delete',
	
	  sync: function (model, options) {
	    var key = this.policy.getKey(model, this.method);
	    var invalidatePromise = this.invalidate(key, options);
	    var syncPromise = Hoard.sync(this.method, model, options);
	    var returnSync = function () { return syncPromise; };
	    return invalidatePromise.then(returnSync);
	  }
	});
	
	module.exports = Delete;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	var Hoard = __webpack_require__(2);
	var StoreHelpers = __webpack_require__(15);
	
	var mergeOptions = ['backend', 'key'];
	
	// The meta store stores all metadata about items in a single entry in the backend.
	// A single entry is used so we can easily iterate over managed keys
	// This API should currently be considered private
	var MetaStore = function (options) {
	  _.extend(this, _.pick(options || {}, mergeOptions));
	  _.defaults(this, { backend: Hoard.backend });
	  this.initialize.apply(this, arguments);
	};
	
	
	_.extend(MetaStore.prototype, Hoard.Events, {
	  initialize: function () {},
	
	  key: 'backbone.hoard.metastore',
	
	  set: function (key, meta, options) {
	    return this._get(options).then(_.bind(function (allMetadata) {
	      allMetadata[key] = meta;
	      return this._set(this.key, allMetadata);
	    }, this));
	  },
	
	  get: function (key, options) {
	    return this._get(options).then(_.bind(function (allMetadata) {
	      return allMetadata[key] || {};
	    }, this));
	  },
	
	  getAll: function (options) {
	    return this._get(options);
	  },
	
	  invalidate: function (key, options) {
	    return this._get(options).then(_.bind(function (allMetadata) {
	      delete allMetadata[key];
	      return this._set(this.key, allMetadata);
	    }, this));
	  },
	
	  invalidateAll: function (options) {
	    return this.removeItem(this.key, options);
	  },
	
	  _get: function (options) {
	    return this.getItem(this.key, options).then(
	      _.identity,
	      function () {
	        return {};
	      }
	    );
	  },
	
	  _set: function (key, meta) {
	    return this.setItem(key, meta);
	  },
	
	  getItem: StoreHelpers.proxyGetItem,
	  setItem: StoreHelpers.proxySetItem,
	  removeItem: StoreHelpers.proxyRemoveItem
	});
	
	MetaStore.extend = Hoard._proxyExtend;
	module.exports = MetaStore;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Hoard = __webpack_require__(2);
	var _ = __webpack_require__(7);
	
	// Convenience methods for stores
	module.exports = {
	  proxySetItem: function (key, value) {
	    return Hoard.Promise.resolve()
	      .then(_.bind(function () {
	        try {
	          return this.backend.setItem(key, JSON.stringify(value));
	        } catch (e) {
	          return Hoard.Promise.reject(e);
	        }
	      }, this))
	      .then(function () {
	        return value;
	      });
	  },
	
	  proxyGetItem: function (key, options) {
	    return Hoard.Promise.resolve()
	      .then(_.bind(function () {
	        return this.backend.getItem(key);
	      }, this))
	      .then(function (raw) {
	        var storedValue = JSON.parse(raw);
	        if (storedValue !== null) {
	          return storedValue;
	        } else {
	          return Hoard.Promise.reject(new Error('Not found'));
	        }
	      });
	  },
	
	  proxyRemoveItem: function (key, options) {
	    return Hoard.Promise.resolve().then(_.bind(function () {
	      return this.backend.removeItem(key);
	    }, this));
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	var Hoard = __webpack_require__(2);
	
	// Internal store to keep track of state of locks
	// Keyed by lock name
	// Stores promises indicating lock access and acquisition
	var locks = {};
	
	// Get lock with name lockName if it exists
	// Create it and return it if it doesn't exist
	var getLock = function (lockName) {
	  var lock = locks[lockName];
	  if (!lock) {
	    lock = {
	      accesses: {}
	    };
	    locks[lockName] = lock;
	  }
	  return lock;
	};
	
	// Return a promise that resolves when all provided promises have either passed or succeeded
	// This differs from Promise.all in that it will not fail immediately if any of the given promises fail
	// and will instead fail once all promises have completed
	var allPromisesComplete = function (promises) {
	  var finalPromise = Hoard.Promise.resolve;
	  var allPromise = _.reduce(promises, function (memo, promise) {
	    var pass = function () { return promise; };
	    var fail = function (error) {
	      finalPromise = Hoard.Promise.reject(error);
	      return promise;
	    };
	    return memo.then(pass, fail);
	  }, Hoard.Promise.resolve());
	  return allPromise.then(function () { return finalPromise; });
	};
	
	// A helper function to wrap a callback with the context of lock access
	// Lock access context is maintained to allow access nested within a lock call
	var callWithLockContext = function (lock, isInsideLock, callback) {
	  return function () {
	    lock.isInsideLock = isInsideLock;
	    var value = callback();
	    delete lock.isInsideLock;
	    return value;
	  };
	};
	
	// A utility method to execute a callback
	// And pass through the failure
	var rejectCallback = function (callback) {
	  return function (failure) {
	    var value = callback(failure);
	    return Hoard.Promise.reject(value);
	  };
	};
	
	// A set of methods to
	// (1) provide exclusive access to a resource
	// (2) provide unbounded access to a resource in the absence of any exclusive access
	// This allows normal method behavior, until mutex behavior is needed
	// Resources are identified by the lockName
	var Lock = {
	  // Acquires lock with name lockName if lock is not already acquired or being accessed
	  // Otherwise, waits until lock is available
	  withLock: function (lockName, callback) {
	    var lock = getLock(lockName);
	    var lockLater = _.bind(this.withLock, this, lockName, callback);
	
	    if (lock.locked) {
	      return lock.locked.then(lockLater, rejectCallback(lockLater));
	    } else if (!_.isEmpty(lock.accesses)) {
	      return allPromisesComplete(lock.accesses).then(lockLater, rejectCallback(lockLater));
	    } else {
	      var cleanLock = function (value) {
	        delete lock.locked;
	        return value;
	      };
	      var acquiredLock = Hoard.Promise.resolve()
	        .then(callWithLockContext(lock, true, callback))
	        .then(cleanLock, rejectCallback(cleanLock));
	      lock.locked = acquiredLock;
	      return acquiredLock;
	    }
	  },
	
	  // Accesses lock with name lockName if lock is not already acquired
	  // Otherwise, waits until lock is available
	  withAccess: function (lockName, callback) {
	    var lock = getLock(lockName);
	    if (lock.locked && !lock.isInsideLock) {
	      var accessLater = _.bind(this.withAccess, this, lockName, callback);
	      return lock.locked.then(accessLater, rejectCallback(accessLater));
	    } else {
	      var accessId = _.uniqueId('backbone.hoard.lock.access_');
	      var cleanLock = function (value) {
	        delete lock.accesses[accessId];
	        return value;
	      };
	      var access = Hoard.Promise.resolve()
	        .then(callWithLockContext(lock, lock.isInsideLock, callback))
	        .then(cleanLock, rejectCallback(cleanLock));
	      lock.accesses[accessId] = access;
	      return access;
	    }
	  },
	
	  // Remove a lock
	  // Only to be used for testing
	  __resetLock: function (lockName) {
	    delete locks[lockName];
	  }
	};
	
	module.exports = Lock;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	var Hoard = __webpack_require__(2);
	var Strategy = __webpack_require__(6);
	
	// A strategy for caching a successful response. Subclasses declare a sync method to adhere use
	module.exports = Strategy.extend({
	  // Cache the response.
	  // If cacheOptions.generateKeyFromResponse is true,
	  // cache using the key from the response, rather than the request
	  sync: function (model, options) {
	    // Don't consider the sync 'complete' until storage is also complete
	    // This ensures that the cache is in sync with the server
	    var storeComplete = Hoard.defer();
	    var cacheOptions = _.extend({
	      onStoreSuccess: storeComplete.resolve,
	      onStoreError: storeComplete.reject
	    }, options, this.cacheOptions(model, options));
	
	    options.success = this._wrapSuccessWithCache(this.method, model, cacheOptions);
	    Hoard.sync(this.method, model, options);
	    return storeComplete.promise;
	  },
	
	  cacheOptions: function (model, options) {}
	});


/***/ }
/******/ ])
});

//# sourceMappingURL=backbone.hoard.js.map