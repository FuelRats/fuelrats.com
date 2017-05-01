'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var Hoard = require('src/backbone.hoard');
var Store = require('src/store');
var Policy = require('src/policy');
var Strategy = require('src/strategy');
var CreateStrategy = require('src/create-strategy');
var UpdateStrategy = require('src/update-strategy');
var PatchStrategy = require('src/patch-strategy');

describe("Positive write strategies", function () {
  beforeEach(function () {
    this.store = new Store();

    this.policy = new Policy();
    this.metadata = { myMeta: true };
    this.key = 'key';
    this.serverResponse = { myResponse: true };
    this.sinon.stub(this.policy, 'getKey').returns(this.key);
    this.sinon.stub(this.policy, 'getMetadata').returns(this.metadata);

    this.sinon.stub(this.store, 'get').returns(Hoard.Promise.resolve(this.serverResponse));
    this.sinon.stub(this.store, 'set').returns(Hoard.Promise.resolve());

    this.Model = Backbone.Model.extend({ url: this.key });
    this.model = new this.Model();
    this.sinon.spy(Hoard, 'sync');

    this.options = {
      success: this.sinon.stub(),
      error: this.sinon.stub()
    };

    this.sinon.stub(Strategy.prototype, 'decorateOptions', function (model, options) {
      return options;
    });
  });

  describe("Create", function () {
    beforeEach(function () {
      this.strategy = new CreateStrategy({
        store: this.store,
        policy: this.policy
      });
      this.execution = this.strategy.execute(this.model, this.options);
    });

    it("always calls the underlying model's sync with the same arguments", function () {
      expect(Hoard.sync).to.have.been.calledOnce
        .and.calledWith('create', this.model, this.options);
    });

    it("writes to the cache when the response returns", function () {
      this.ajax.resolve(this.serverResponse);
      return this.ajaxResponse.then(function () {
        expect(this.store.set).to.have.been.calledOnce
          .and.calledWith(this.key, this.serverResponse, this.metadata);
      }.bind(this));
    });
  });

  describe("Update", function () {
    beforeEach(function () {
      this.strategy = new UpdateStrategy({
        store: this.store,
        policy: this.policy
      });
      this.execution = this.strategy.execute(this.model, this.options);
    });

    it("always calls the underlying model's sync with the same arguments", function () {
      expect(Hoard.sync).to.have.been.calledOnce
        .and.calledWith('update', this.model, this.options);
    });

    it("writes to the cache when the response returns", function () {
      this.ajax.resolve(this.serverResponse);
      return this.ajaxResponse.then(function () {
        expect(this.store.set).to.have.been.calledOnce
          .and.calledWith(this.key, this.serverResponse, this.metadata);
      }.bind(this));
    });
  });

  describe("Patch", function () {
    beforeEach(function () {
      this.strategy = new PatchStrategy({
        store: this.store,
        policy: this.policy
      });
      this.execution = this.strategy.execute(this.model, this.options);
    });

    it("always calls the underlying model's sync with the same arguments", function () {
      expect(Hoard.sync).to.have.been.calledOnce
        .and.calledWith('patch', this.model, this.options);
    });

    it("writes to the cache when the response returns", function () {
      this.ajax.resolve(this.serverResponse);
      return this.ajaxResponse.then(function () {
        expect(this.store.set).to.have.been.calledOnce
          .and.calledWith(this.key, this.serverResponse, this.metadata);
      }.bind(this));
    });
  });
});