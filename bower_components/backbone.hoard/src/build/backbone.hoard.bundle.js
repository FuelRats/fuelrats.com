'use strict';

var Backbone = require('backbone');
var Hoard = require('../backbone.hoard');
Hoard.Store = require('../store');
Hoard.Policy = require('../policy');
Hoard.Control = require('../control');
Hoard.Strategy = require('../strategy');

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
