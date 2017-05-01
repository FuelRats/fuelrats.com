'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var Hoard = require('src/backbone.hoard');
var Strategy = require('src/strategy');
var Policy = require('src/policy');

describe("Strategy", function () {
  beforeEach(function () {
    this.strategy = new Strategy({
      policy: new Policy()
    });
    this.strategy.sync = this.sinon.stub()
      .returns(Hoard.Promise.resolve());
  });

  describe("execute", function () {
    beforeEach(function () {
      this.collection = new Backbone.Collection();
      this.model = new Backbone.Model();
      this.options = {};
      this.url = '/models/1';
      this.sinon.stub(this.strategy.policy, 'getUrl').returns(this.url);
      this.sinon.stub(this.strategy.policy, 'getCollection').returns(this.collection);
      return this.strategy.execute(this.model, this.options);
    });

    it("calls sync with modified options", function () {
      expect(this.strategy.sync).to.have.been.calledOnce
        .and.calledOn(this.strategy)
        .and.calledWith(this.model, {
          model: this.model,
          collection: this.collection,
          url: this.url
        });
    });

    it("does not modify the options directly", function () {
      expect(this.options).to.eql({});
    });
  });
});