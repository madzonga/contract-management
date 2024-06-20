import { expect } from 'chai';
import sinon from 'sinon';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';
import { withRetry } from '../database/utils';

describe.only('withRetry', () => {
  let sandbox: sinon.SinonSandbox;
  let transactionStub: sinon.SinonStub;
  let commitStub: sinon.SinonStub;
  let rollbackStub: sinon.SinonStub;
  let trx: Transaction;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    trx = {
      commit: sinon.stub(),
      rollback: sinon.stub(),
    } as unknown as Transaction;
    transactionStub = sandbox.stub(sequelize, 'transaction').resolves(trx);
    commitStub = trx.commit as sinon.SinonStub;
    rollbackStub = trx.rollback as sinon.SinonStub;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should successfully execute the function without retries', async () => {
    const fn = sinon.stub().resolves('success');

    const result = await withRetry(fn);

    expect(result).to.equal('success');
    expect(fn.calledOnce).to.be.true;
    expect(commitStub.calledOnce).to.be.true;
    expect(rollbackStub.notCalled).to.be.true;
    expect(transactionStub.calledOnce).to.be.true;
  });

  it('should retry on SQLITE_BUSY error and succeed', async () => {
    const fn = sinon.stub();
    fn.onCall(0).rejects({
      name: 'SequelizeDatabaseError',
      parent: { code: 'SQLITE_BUSY' },
    });
    fn.onCall(1).resolves('success');

    const result = await withRetry(fn);

    expect(result).to.equal('success');
    expect(fn.calledTwice).to.be.true;
    expect(commitStub.calledOnce).to.be.true;
    expect(rollbackStub.calledOnce).to.be.true;
    expect(transactionStub.calledTwice).to.be.true;
  });

  it('should throw an error after exceeding the retry limit', async () => {
    const fn = sinon.stub();
    fn.rejects({
      name: 'SequelizeDatabaseError',
      parent: { code: 'SQLITE_BUSY' },
    });

    try {
      await withRetry(fn);
      expect.fail('Expected withRetry to throw an error');
    } catch (error: any) {
      expect(error).to.have.property('name', 'SequelizeDatabaseError');
      expect(error.parent).to.have.property('code', 'SQLITE_BUSY');
    }

    expect(fn.callCount).to.equal(3);
    expect(commitStub.notCalled).to.be.true;
    expect(rollbackStub.callCount).to.equal(3);
    expect(transactionStub.callCount).to.equal(3);
  });

  it('should throw an error without retrying for non-SQLITE_BUSY errors', async () => {
    const fn = sinon.stub();
    const error = new Error('Other error');
    fn.rejects(error);

    try {
      await withRetry(fn);
      expect.fail('Expected withRetry to throw an error');
    } catch (err: any) {
      expect(err).to.equal(error);
    }

    expect(fn.calledOnce).to.be.true;
    expect(commitStub.notCalled).to.be.true;
    expect(rollbackStub.calledOnce).to.be.true;
    expect(transactionStub.calledOnce).to.be.true;
  });
});