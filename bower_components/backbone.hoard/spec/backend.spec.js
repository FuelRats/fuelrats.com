'use strict';

var Backend = require('src/backend');

describe("Backend", function () {
  beforeEach(function () {
    this.backend = new Backend();
    this.key = 'key';
    this.value = JSON.stringify({ value: true });
  });

  describe("when created", function () {
    it("storage is empty", function () {
      expect(this.backend.storage).to.eql({});
    });

    it("has size 0", function () {
      expect(this.backend.size).to.equal(0);
    });
  });

  describe("setItem", function () {
    describe("when there is space available", function () {
      beforeEach(function () {
        this.backend.setItem(this.key, this.value);
      });

      it("adds the item to storage under key", function () {
        expect(this.backend.storage[this.key]).to.eql(this.value);
      });

      it("increases the size by the length of the value", function () {
        expect(this.backend.size).to.equal(this.value.length);
      });
    });

    describe("when the cache is full", function () {
      beforeEach(function () {
        this.backend.maxSize = 0;
        this.setItem = this.backend.setItem.bind(this.backend, this.key, this.value);
      });

      it("throws an error", function () {
        expect(this.setItem).to.throw();
      });

      it("does not set the value in storage", function () {
        expect(this.backend.getItem(this.key)).to.be.null;
      });

      it("does not adjust the size", function () {
        expect(this.backend.size).to.equal(0);
      });
    });
  });

  describe("getItem", function () {
    beforeEach(function () {
      this.backend.setItem(this.key, this.value);
    });

    it("returns the value stored under the given key", function () {
      expect(this.backend.getItem(this.key)).to.eql(this.value);
    });

    it("returns null if nothing is stored under the given key", function () {
      expect(this.backend.getItem('not-key')).to.be.null;
    });
  });

  describe("removeItem", function () {
    beforeEach(function () {
      this.backend.setItem(this.key, this.value);
      this.backend.removeItem(this.key);
    });

    it("removes the item from storage", function () {
      expect(this.backend.getItem(this.key)).to.be.null;
    });

    it("adjusts the size", function () {
      expect(this.backend.size).to.equal(0);
    });
  });
});