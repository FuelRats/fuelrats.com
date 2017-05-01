'use strict';

var TimeSensitivePolicy = require('recipe/time-sensitive-policy');

describe("Recipe: TimeSensitivePolicy", function () {
  describe("getMetadata", function () {
    describe("cache expiration", function () {
      beforeEach(function () {
        this.clock = this.sinon.useFakeTimers(5);
      });

      afterEach(function () {
        this.clock.restore();
      });

      it("sets expiration based on the expires property", function () {
        var policy = new TimeSensitivePolicy({ expires: 1234 });
        expect(policy.getMetadata()).to.eql({ expires: 1234 });
      });

      it("uses the timeToLive property to calculate expires", function () {
        var policy = new TimeSensitivePolicy({ timeToLive: 10 });
        var meta = policy.getMetadata();
        expect(meta).to.eql({ expires: 15 });
      });

      it("prefers expires to timeToLive", function () {
        var policy = new TimeSensitivePolicy({ expires: 100, timeToLive: 10 });
        var meta = policy.getMetadata();
        expect(meta).to.eql({ expires: 100 });
      });
    });
  });
});