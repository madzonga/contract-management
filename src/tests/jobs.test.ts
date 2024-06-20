import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import app from '../app'; // Adjust the import to your Express app
import { Contract, Job, Profile } from '../models';
import { sequelize } from '../models';
import { Transaction } from 'sequelize';

const request = supertest(app);

describe('Jobs Controller', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /jobs/unpaid', () => {
    it('should return unpaid jobs', async () => {
      const mockJobs = [{ id: 1, paid: false, price: 200, Contract: { status: 'active' } as unknown as Contract }] as unknown[] as Job[];
      sandbox.stub(Job, 'findAll').resolves(mockJobs);

      const res = await request
        .get('/jobs/unpaid')
        .set('profile_id', '1')
        .expect(200);

      expect(res.body).to.deep.equal(mockJobs);
    });
  });

  describe('POST /jobs/:job_id/pay', () => {
    it('should return 404 if job not found', async () => {
      sandbox.stub(Job, 'findOne').resolves(null);

      const res = await request
        .post('/jobs/1/pay')
        .set('profile_id', '1')
        .send({ job_id: 1 })
        .expect(404);

      expect(res.body).to.be.empty;
    });

    it('should return 400 if job is already paid', async () => {
      const mockJob = { id: 1, paid: true, price: 200, Contract: { ClientId: 1, ContractorId: 2 } as unknown as Contract } as unknown as Job;
      sandbox.stub(Job, 'findOne').resolves(mockJob);

      const res = await request
        .post('/jobs/1/pay')
        .set('profile_id', '1')
        .send({ job_id: 1 })
        .expect(400);

      expect(res.body.message).to.equal('Job is already paid');
    });

    it('should return 400 if client has insufficient balance', async () => {
      const mockJob = {
        id: 1,
        price: 200,
        paid: false,
        Contract: { ClientId: 1, ContractorId: 2 } as unknown as Contract
      } as unknown as Job;
      const mockClient = { id: 1, balance: 100, save: sinon.stub().resolves() } as unknown as Profile;
      const mockContractor = { id: 2, balance: 100, save: sinon.stub().resolves() } as unknown as Profile;

      sandbox.stub(Job, 'findOne').resolves(mockJob);
      sandbox.stub(Profile, 'findOne').onFirstCall().resolves(mockClient).onSecondCall().resolves(mockContractor);

      const transactionStub = sandbox.stub(sequelize, 'transaction').callsFake(async (arg1: any, arg2?: any) => {
        const trx = {
          commit: sinon.stub().resolves(),
          rollback: sinon.stub().resolves(),
          LOCK: {
            UPDATE: 'UPDATE'
          }
        } as unknown as Transaction;

        if (typeof arg1 === 'function') {
          await arg1(trx);
        } else if (typeof arg2 === 'function') {
          await arg2(trx);
        }

        return trx;
      });

      const res = await request
        .post('/jobs/1/pay')
        .set('profile_id', '1')
        .send({ job_id: 1 })
        .expect(400);

      expect(res.body.message).to.equal('Insufficient balance');
    });

    it('should return 500 if there is an internal server error', async () => {
      const mockJob = {
        id: 1,
        price: 200,
        paid: false,
        Contract: { ClientId: 1, ContractorId: 2 } as unknown as Contract
      } as unknown as Job;
      const mockClient = { id: 1, balance: 300, save: sinon.stub().resolves() } as unknown as Profile;
      const mockContractor = { id: 2, balance: 100, save: sinon.stub().resolves() } as unknown as Profile;

      sandbox.stub(Job, 'findOne').resolves(mockJob);
      sandbox.stub(Profile, 'findOne').onFirstCall().resolves(mockClient).onSecondCall().resolves(mockContractor);

      const transactionStub = sandbox.stub(sequelize, 'transaction').callsFake(async (arg1: any, arg2?: any) => {
        const trx = {
          commit: sinon.stub().resolves(),
          rollback: sinon.stub().resolves(),
          LOCK: {
            UPDATE: 'UPDATE'
          }
        } as unknown as Transaction;
        throw new Error('Internal server error');
      });

      const res = await request
        .post('/jobs/1/pay')
        .set('profile_id', '1')
        .send({ job_id: 1 })
        .expect(500);

      expect(res.body.message).to.equal('Error paying job');
      expect(transactionStub.calledOnce).to.be.true;
    });
  });
});