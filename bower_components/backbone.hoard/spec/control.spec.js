'use strict';

var Control = require('src/control');

describe("Control", function () {
  beforeEach(function () {
    this.control = new Control();
    this.model = { model: true };
    this.options = { options: true };
  });

  describe("sync", function () {
    it("executes the create strategy when the method is create", function () {
      this.sinon.stub(this.control.createStrategy, 'execute');
      this.control.sync('create', this.model, this.options);
      expect(this.control.createStrategy.execute).to.have.been.calledOnce
        .and.calledWith(this.model, this.options);
    });

    it("executes the read strategy when the method is create", function () {
      this.sinon.stub(this.control.readStrategy, 'execute');
      this.control.sync('read', this.model, this.options);
      expect(this.control.readStrategy.execute).to.have.been.calledOnce
        .and.calledWith(this.model, this.options);
    });

    it("executes the update strategy when the method is update", function () {
      this.sinon.stub(this.control.updateStrategy, 'execute');
      this.control.sync('update', this.model, this.options);
      expect(this.control.updateStrategy.execute).to.have.been.calledOnce
        .and.calledWith(this.model, this.options);
    });

    it("executes the delete strategy when the method is delete", function () {
      this.sinon.stub(this.control.deleteStrategy, 'execute');
      this.control.sync('delete', this.model, this.options);
      expect(this.control.deleteStrategy.execute).to.have.been.calledOnce
        .and.calledWith(this.model, this.options);
    });

    it("executes the patch strategy when the method is patch", function () {
      this.sinon.stub(this.control.patchStrategy, 'execute');
      this.control.sync('patch', this.model, this.options);
      expect(this.control.patchStrategy.execute).to.have.been.calledOnce
        .and.calledWith(this.model, this.options);
    });
  });

  describe("getModelSync", function () {
    beforeEach(function () {
      this.sinon.stub(this.control, 'sync');
      this.sync = this.control.getModelSync();
      this.method = 'read';
      this.sync(this.method, this.model, this.options);
    });

    it("calls the control's sync method with the provided arguments", function () {
      expect(this.control.sync).to.have.been.calledOnce
        .and.calledWith(this.method, this.model, this.options)
        .and.calledOn(this.control);
    });
  });
});