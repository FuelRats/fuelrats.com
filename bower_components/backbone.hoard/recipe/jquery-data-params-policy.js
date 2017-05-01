'use strict';

var Policy = require('../src/policy');
var _ = require('underscore');

/**
 * This Policy handles converting jQuery `options.data` to a queryParam string
 * The given implementation only works on immediately serializable parameters
 *   and probaly does not account for everything jQuery handles
 * (That's partially why this is a recipe and not core code)
 */
module.exports = Policy.extend({
  getKey: function (model, method, options) {
    var data, queryParams, paramKeys, startOfQuery;
    var key = Policy.prototype.getKey.call(this, model, method, options);

    // Convert options.data to query params with a GET request
    if (method === 'read') {
      data = _.result(options, 'data');

      // If data is an object, convert to a query string
      // Otherwise, accept that data is a string and just use that
      if (_.isObject(data)) {
        // Sort for consistency to ensure cache hits when appropriate
        paramKeys = _.keys(data).sort();
        queryParams = _.reduce(paramKeys, function (memo, key) {
          var value = data[key];
          return memo + '&' + key + '=' + value;
        }, '');
      } else {
        queryParams = data;
      }
    }

    // If we have query params, add them
    if (queryParams) {
      startOfQuery = queryParams.charAt(0);
      // If no existing query string, start one
      // else, append
      if (key.indexOf('?') === -1) {
        if (startOfQuery === '&') {
          queryParams = queryParams.slice(1);
        }
        key += '?' + queryParams;
      } else {
        if (startOfQuery !== '&') {
          queryParams = '&' + queryParams;
        }
        key += queryParams;
      }
    }

    return key;
  }
});