'use strict';

var Hoard = require('src/backbone.hoard');
var Store = require('src/store');
var Policy = require('src/policy');
var Backbone = require('backbone');
var DeleteStrategy = require('src/delete-strategy');

describe("Delete Strategy", function () {
  beforeEach(function () {
    this.store = new Store();
    this.sinon.stub(this.store, 'invalidate').returns(Hoard.Promise.resolve());

    this.policy = new Policy();
    this.key = 'key';
    this.sinon.stub(this.policy, 'getKey').returns(this.key);

    this.Model = Backbone.Model.extend({ url: this.key });
    this.model = new this.Model();
    this.sinon.spy(this.model, 'sync');

    this.options = {
      success: this.sinon.stub(),
      error: this.sinon.stub()
    };

    this.strategy = new DeleteStrategy({
      store: this.store,
      policy: this.policy
    });

    this.execution = this.strategy.execute(this.model, this.options);
  });

  it("invalidates the cache", function () {
    expect(this.store.invalidate).to.have.been.calledOnce
      .and.calledWith(this.key);
  });
});
