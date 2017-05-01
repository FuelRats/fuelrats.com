'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var Backbone = require('backbone');
var Hoard = require('src/backbone.hoard');
var Promise = require('es6-promise').Promise;

global.expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

var stubAjax = function (spec) {
  var ajax = Hoard.defer();
  var ajaxResponse = Hoard.defer();

  spec.ajax = ajax;
  spec.ajaxResponse = ajaxResponse.promise;

  spec.sinon.stub(Backbone, 'ajax', function (options) {
    ajax.promise.then(function (serverResponse) {
      options.success(serverResponse);
    }, function (serverError) {
      options.error(serverError);
    }).then(function () {
      ajaxResponse.resolve();
    });

    return ajaxResponse.promise;
  });
};

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
  Hoard.Promise = Promise;
  stubAjax(this);
});

afterEach(function () {
  this.sinon.restore();
});