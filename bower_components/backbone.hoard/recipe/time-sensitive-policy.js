'use strict';

var Policy = require('../src/policy');

module.exports = Policy.extend({
  // How long, in milliseconds, should a cached item be considered 'fresh'?
  // Superceded by the `expires` option, which determines at what time the cache item becomes stale
  timeToLive: 5 * 60 * 1000,

  // Add the expiration timestamp to the metadata
  getMetadata: function (key, response, options) {
    var meta = {};
    var expires = this.expires;
    if (this.timeToLive != null && expires == null) {
      expires = Date.now() + this.timeToLive;
    }
    if (expires != null) {
      meta.expires = expires;
    }
    return meta;
  },

  // Return true if the expiration has been reached
  shouldEvictItem: function (meta) {
    return meta.expires != null && meta.expires < Date.now();
  }
});