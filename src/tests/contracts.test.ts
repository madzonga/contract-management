import request from 'supertest';
import { expect } from 'chai';
import app from '../app';

describe('Contracts API', () => {
  describe('GET /contracts', () => {
    it('should return all active contracts for the profile making the request', async () => {
      const res = await request(app)
        .get('/contracts')
        .set('profile_id', '1')
        .expect(200);

      expect(res.body).to.be.an('array');
      res.body.forEach((contract: any) => {
        expect(contract).to.have.property('id');
        expect(contract).to.have.property('terms');
        expect(contract).to.have.property('status');
        expect(contract.status).to.not.equal('terminated');
      });
    });
  });

  describe('GET /contracts/:id', () => {
    it('should return the specific contract by its ID', async () => {
      const res = await request(app)
        .get('/contracts/1')
        .set('profile_id', '1') 
        .expect(200);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
      expect(res.body.id).to.equal(1);
      expect(res.body).to.have.property('terms');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('ClientId');
      expect(res.body).to.have.property('ContractorId');
    });

    it('should return 404 if the contract is not found', async () => {
      const res = await request(app)
        .get('/contracts/999')
        .set('profile_id', '1') 
        .expect(404);

      expect(res.body).to.be.empty;
    });
  });
});