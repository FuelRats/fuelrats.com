'use strict';

var _ = require('underscore');

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
