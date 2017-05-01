'use strict';

var Hoard = require('src/backbone.hoard');
var Store = require('src/store');
var Policy = require('src/policy');
var Backbone = require('backbone');
var ReadStrategy = require('src/read-strategy');

describe("Read Strategy", function () {
  beforeEach(function () {
    this.store = new Store();

    this.policy = new Policy();
    this.key = 'key';
    this.sinon.stub(this.policy, 'getKey').returns(this.key);

    this.Model = Backbone.Model.extend({ url: this.key });
    this.model = new this.Model();

    this.options = {
      success: this.sinon.stub(),
      error: this.sinon.stub()
    };

    this.strategy = new ReadStrategy({
      store: this.store,
      policy: this.policy
    });

    this.sinon.stub(this.strategy, 'decorateOptions', function (model, options) {
      return options;
    });
  });

  describe("on a cache miss", function () {
    beforeEach(function () {
      this.cacheResponse = Hoard.Promise.reject();
      this.sinon.stub(this.store, 'get').returns(this.cacheResponse);

      this.setPromise = Hoard.Promise.resolve();
      this.sinon.stub(this.store, 'set').returns(this.setPromise);
      this.sinon.stub(this.store, 'invalidate').returns(Hoard.Promise.resolve());

      this.metadata = { myMeta: true };
      this.serverResponse = { myResponse: true };
      this.sinon.stub(this.policy, 'getMetadata').returns(this.metadata);

      this.execution = this.strategy.execute(this.model, this.options);
    });

    it("returns a promise that resolves when the get and sync resolve", function () {
      this.ajax.resolve(this.serverResponse);
      return expect(this.execution).to.have.been.fulfilled;
    });

    it("writes a placeholder", function () {
      expect(this.strategy.placeholders[this.key].accesses).to.equal(1);
      expect(this.strategy.placeholders[this.key].promise).to.be.an.instanceOf(Hoard.Promise);
    });

    it("writes to the cache on a successful sync", function () {
      this.ajax.resolve(this.serverResponse);
      return this.execution.then(function () {
        expect(this.store.set).to.have.been.calledOnce
          .and.calledWith(this.key, this.serverResponse, this.metadata);
      }.bind(this));
    });

    it("invalidates the cache on a failed sync", function () {
      this.ajax.reject(this.serverResponse);
      return this.execution.catch(function () {
        expect(this.store.invalidate).to.have.been.calledOnce
          .and.calledWith(this.key);
      }.bind(this));
    });
  });

  describe("on an expired cache hit", function () {
    beforeEach(function () {
      this.getPromise = Hoard.Promise.resolve();
      this.sinon.stub(this.store, 'get').returns(this.getPromise);
      this.sinon.stub(this.store, 'getMetadata').returns(Hoard.Promise.resolve());
      this.sinon.stub(this.store, 'invalidate').returns(Hoard.Promise.resolve());
      this.sinon.stub(this.policy, 'shouldEvictItem').returns(true);
      this.sinon.stub(this.strategy, 'onCacheMiss').returns(Hoard.Promise.resolve());
      return this.execution = this.strategy.execute(this.model, this.options);
    });

    it("invalidates the cache", function () {
      expect(this.store.invalidate).to.have.been.calledOnce
        .and.calledWith(this.key);
    });

    it("acts as a cache miss", function () {
      expect(this.strategy.onCacheMiss).to.have.been.calledOnce
        .and.calledWith(this.key, this.model, this.options);
    });
  });

  describe("on a placeholder cache hit", function () {
    beforeEach(function () {
      this.serverDeferred = Hoard.defer();
      this.strategy.placeholders[this.key] = {
        accesses: 1,
        promise: this.serverDeferred.promise
      };
      this.getPromise = Hoard.Promise.reject();
      this.serverResponse = { myResponse: true };
      this.execution = this.strategy.execute(this.model, this.options);
    });

    it("calls options.success on a successful cache", function () {
      this.serverDeferred.resolve(this.serverResponse);
      return this.execution.then(function () {
        expect(this.options.success).to.have.been.calledOnce
          .and.calledWith(this.serverResponse);
      }.bind(this));
    });

    it("calls options.error on an error cache event", function () {
      this.serverDeferred.reject(this.serverResponse);
      return this.execution.then(undefined, function () {
        expect(this.options.error).to.have.been.calledOnce
          .and.calledWith(this.serverResponse);
      }.bind(this));
    });
  });

  describe("on a cache hit", function () {
    beforeEach(function () {
      this.cacheItem = { };
      this.sinon.stub(this.store, 'get').returns(Hoard.Promise.resolve(this.cacheItem));
      this.sinon.stub(this.store, 'getMetadata').returns(Hoard.Promise.resolve());
      this.sinon.stub(this.policy, 'shouldEvictItem').returns(false);
      this.execution = this.strategy.execute(this.model, this.options);
    });

    it("calls options.success with the retreived item", function () {
      return this.execution.then(function () {
        expect(this.options.success).to.have.been.calledOnce
          .and.calledWith(this.cacheItem);
      }.bind(this));
    });
  });

  describe("(#15) avoiding race conditions" , function () {
    describe("on multiple cache misses, with one cache miss completely resolving before the other", function () {
      beforeEach(function () {
        this.missDeferreds = [Hoard.defer(), Hoard.defer()];
        this.sinon.stub(this.store, 'get');
        this.store.get.onCall(0).returns(this.missDeferreds[0].promise);
        this.store.get.onCall(1).returns(this.missDeferreds[1].promise);
        this.models = [new this.Model(), new this.Model()];
        this.executions = [
          this.strategy.execute(this.models[0], this.options),
          this.strategy.execute(this.models[1], this.options)
        ];

        this.response = { myResponse: true };
        this.sinon.spy(Hoard, 'sync');
        this.sinon.stub(this.store, 'set').returns(Hoard.Promise.resolve());

        this.missDeferreds[0].reject();
        return this.missDeferreds[0].promise.catch(function () {
          this.ajax.resolve(this.response);
          return this.executions[0];
        }.bind(this)).then(function () {
          this.missDeferreds[1].reject();
          return this.executions[1];
        }.bind(this));
      });

      it("only calls sync once", function () {
        expect(Hoard.sync).to.have.been.calledOnce
          .and.calledWith('read', this.models[0], this.options);
      });
    });
  });
});
