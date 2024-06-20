import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../app';
import { Job } from '../models/job';

describe('Admin Endpoints', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /admin/best-profession', () => {
    it('should return the best profession', async () => {
      const mockBestProfession = [{
        Contract: {
          Contractor: {
            profession: 'Engineer'
          }
        },
        getDataValue: (key: string) => {
          if (key === 'total_earned') return '10000';
          return null;
        }
      }];

      sandbox.stub(Job, 'findAll').resolves(mockBestProfession as any);

      const res = await request(app)
        .get('/admin/best-profession')
        .query({ start: '2023-01-01', end: '2023-12-31' })
        .expect(200);

      expect(res.body).to.deep.equal({
        profession: 'Engineer',
        totalEarned: 10000
      });
    });
  });

  describe('GET /admin/best-clients', () => {
    it('should return the best clients', async () => {
      const mockBestClients = [{
        Contract: {
          Client: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        getDataValue: (key: string) => {
          if (key === 'total_paid') return 1000;
          return null;
        }
      }, {
        Contract: {
          Client: {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith'
          }
        },
        getDataValue: (key: string) => {
          if (key === 'total_paid') return 900;
          return null;
        }
      }];

      sandbox.stub(Job, 'findAll').resolves(mockBestClients as any);

      const res = await request(app)
        .get('/admin/best-clients')
        .query({ start: '2023-01-01', end: '2023-12-31', limit: 2 })
        .expect(200);

      expect(res.body).to.deep.equal([
        {
          id: 1,
          fullName: 'John Doe',
          paid: 1000
        },
        {
          id: 2,
          fullName: 'Jane Smith',
          paid: 900
        }
      ]);
    });
  });
});