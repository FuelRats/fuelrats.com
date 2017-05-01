var Hoard = require('src/backbone.hoard');
var Lock = require('src/lock');

describe("Lock", function () {
  afterEach(function () {
    Lock.__resetLock('lock');
  });

  describe("withAccess", function () {
    describe("when the lock is unlocked", function () {
      beforeEach(function () {
        this.firstAccessDeferred = Hoard.defer();
        this.firstAccess = Lock.withAccess('lock', function () {
          return this.firstAccessDeferred.promise;
        }.bind(this));

        this.value = 'value';
        this.secondAccess = Lock.withAccess('lock', function () {
          return this.value;
        }.bind(this));
      });

      it("returns the promise resulting from the callback", function () {
        this.firstAccessDeferred.resolve(this.value);
        return expect(this.firstAccess).to.eventually.equal(this.value);
      });

      it("allows multiple accesses", function () {
        return expect(this.secondAccess).to.eventually.equal(this.value);
      });
    });

    describe("when the lock is locked", function () {
      beforeEach(function () {
        this.lockDeferred = Hoard.defer();
        this.locked = Lock.withLock('lock', function () {
          return this.lockDeferred.promise;
        }.bind(this));

        this.accessCall = this.sinon.stub();
        this.access = Lock.withAccess('lock', this.accessCall);
      });

      it("executes the given function when the lock is released", function () {
        this.lockDeferred.resolve();
        expect(this.accessCall).not.to.have.been.called;
        return this.access.then(function () {
          expect(this.accessCall).to.have.been.calledOnce;
        }.bind(this));
      });
    });

    describe("within a lock", function () {
      beforeEach(function () {
        this.value = 'value';

        this.nestedLock = Lock.withLock('lock', function () {
          return Lock.withAccess('lock', function () {
            return this.value;
          }.bind(this));
        }.bind(this));

        this.deepLock = Lock.withLock('lock', function () {
          return Lock.withAccess('lock', function () {
            return Lock.withAccess('lock', function () {
              return this.value;
            }.bind(this));
          }.bind(this));
        }.bind(this));
      });

      it("allows nested access", function () {
        return expect(this.nestedLock).to.eventually.equal(this.value);
      });

      it("allows arbitrarily deep access", function () {
        return expect(this.deepLock).to.eventually.equal(this.value);
      });
    });
  });

  describe("withLock", function () {
    beforeEach(function () {
      this.lockDeferred = Hoard.defer();
      this.firstLock = Lock.withLock('lock', function () {
        return this.lockDeferred.promise;
      }.bind(this));

      this.accessCall = this.sinon.stub();
      this.access = Lock.withAccess('lock', this.accessCall);

      this.lockCall = this.sinon.stub();
      this.secondLock = Lock.withLock('lock', this.lockCall);
    });

    it("does not execute until all accesses are resolved", function () {
      expect(this.accessCall).not.to.have.been.called;
      this.lockDeferred.resolve();
      return this.access.then(function () {
        expect(this.accessCall).to.have.been.calledOnce;
      }.bind(this));
    });

    it("prevents the lock from being used until the promise returns", function () {
      expect(this.lockCall).not.to.have.been.called;
      this.lockDeferred.resolve();
      return this.secondLock.then(function () {
        expect(this.lockCall).to.have.been.calledOnce;
      }.bind(this));
    });
  });
});