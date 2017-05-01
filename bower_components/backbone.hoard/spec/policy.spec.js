'use strict';

var Backbone = require('backbone');
var Policy = require('src/policy');

describe("Policy", function () {
  beforeEach(function () {
    this.policy = new Policy();
  });

  it("getMetadata returns an empty object", function () {
    expect(this.policy.getMetadata({ object: true })).to.eql({});
  });

  it("shouldEvictItem returns false", function () {
    expect(this.policy.shouldEvictItem({ evictMe: true })).to.be.false;
  });

  describe("backbone configuration", function () {
    beforeEach(function () {
      this.Model = Backbone.Model.extend({url: 'url'});
      this.model = new this.Model({ id: 1, value: 1 });
      this.collection = new Backbone.Collection();
      this.collection.add(this.model);
    });

    it("getKey should return the result of the url, by default", function () {
      expect(this.policy.getKey(this.model)).to.equal(this.model.url);
    });

    it("getUrl should return the result of the url, by default", function () {
      expect(this.policy.getUrl(this.model)).to.equal(this.model.url);
    });

    it("getData should return the attributes of the given model", function () {
      expect(this.policy.getData(this.model)).to.deep.eql({ id: 1, value: 1 });
    });

    it("getCollection should return the collection of the given model", function () {
      expect(this.policy.getData(this.model)).to.deep.eql({ id: 1, value: 1 });
    });

    it("areModelsSame should return true if the raw models have the same id", function () {
      expect(this.policy.areModelsSame({ id: 1, v: 1}, { id: 1, v: 2 })).to.be.true;
      expect(this.policy.areModelsSame({ id: 1, v: 1}, { id: 2, v: 1 })).to.be.false;
    });

    it("findSameModel should return the model with the same id", function () {
      var collection = [{ id: 1, v: 1 }, { id: 2, v: 2 }];
      var model = { id: 2, v: 1 };
      expect(this.policy.findSameModel(collection, model)).to.deep.eql({ id: 2, v: 2});
    });
  });
});
