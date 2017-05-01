'use strict';

var Backbone = require('backbone');
var ParamsPolicy = require('recipe/jquery-data-params-policy');

describe("JqueryDataParamsPolicy", function () {
  beforeEach(function () {
    this.model = new Backbone.Model();
    this.policy = new ParamsPolicy();
    this.model.url = '/model';
    this.options = {
      data: { a: 1, b: 7 }
    };
  });

  describe("getKey", function () {
    it("adds the `data` option as query params", function () {
      var key = this.policy.getKey(this.model, 'read', this.options);
      expect(key).to.equal('/model?a=1&b=7');
    });

    it("puts query params in alphabetical order", function () {
      this.options.data = { b: 7, a: 1 };
      var key = this.policy.getKey(this.model, 'read', this.options);
      expect(key).to.equal('/model?a=1&b=7');
    });

    it("extends an existing query string", function () {
      this.model.url = '/model?param=true';
      var key = this.policy.getKey(this.model, 'read', this.options);
      expect(key).to.equal('/model?param=true&a=1&b=7');
    });

    it("appends data if data is a string", function () {
      this.options.data = 'd=4&c=7';
      var key = this.policy.getKey(this.model, 'read', this.options);
      expect(key).to.equal('/model?d=4&c=7');
    });

    it("handles an empty data hash", function () {
      this.options.data = {};
      var key = this.policy.getKey(this.model, 'read', this.options);
      expect(key).to.equal('/model');
    });

    it("handles options without data", function () {
      var key = this.policy.getKey(this.model, 'read', {});
      expect(key).to.equal('/model');
    });

    it("handles undefined options", function () {
      var key = this.policy.getKey(this.model, 'read');
      expect(key).to.equal('/model');
    });

    it("does not add query params for a create", function () {
      var key = this.policy.getKey(this.model, 'create', this.options);
      expect(key).to.equal('/model');
    });

    it("does not add query params for a update", function () {
      var key = this.policy.getKey(this.model, 'create', this.options);
      expect(key).to.equal('/model');
    });

    it("does not add query params for a patch", function () {
      var key = this.policy.getKey(this.model, 'patch', this.options);
      expect(key).to.equal('/model');
    });

    it("does not add query params for a delete", function () {
      var key = this.policy.getKey(this.model, 'patch', this.options);
      expect(key).to.equal('/model');
    });
  });
});