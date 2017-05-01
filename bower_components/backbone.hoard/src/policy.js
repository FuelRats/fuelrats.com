'use strict';

var _ = require('underscore');
var Hoard = require('./backbone.hoard');

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
