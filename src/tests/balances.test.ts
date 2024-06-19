import request from 'supertest';
import { expect } from 'chai';
import app from '../app';

describe('Balances API', () => {
  describe('POST /balances/deposit/:userId', () => {
    it('should deposit balance to the user account', async () => {
      const depositData = { amount: 1 };

      const res = await request(app)
        .post('/balances/deposit/1')
        .send(depositData)
        .expect(200);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('balance');
      expect(res.body.balance).to.be.a('number');
      expect(res.body.balance).to.be.gte(0); // Ensure balance is non-negative
    });

    it('should return 400 if deposit exceeds 25% of total jobs to pay', async () => {
      const depositData = { amount: 10000 }; // Assuming this exceeds 25% of total jobs to pay

      const res = await request(app)
        .post('/balances/deposit/1')
        .send(depositData)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Deposit exceeds 25% of total jobs to pay');
    });

    it('should return 404 if user is not found', async () => {
      const depositData = { amount: 100 };

      const res = await request(app)
        .post('/balances/deposit/999999999') // Assuming 999999999 is a non-existent user ID
        .send(depositData)
        .expect(404);

      expect(res.body).to.be.empty;
    });

    it('should return 400 if amount is not provided', async () => {
      const res = await request(app)
        .post('/balances/deposit/1')
        .send({}) // No amount provided
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('"amount" is required'); // Assuming Joi validation error message
    });

    it('should return 400 if amount is not a number', async () => {
      const depositData = { amount: 'invalid_amount' }; // Invalid amount

      const res = await request(app)
        .post('/balances/deposit/1')
        .send(depositData)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('"amount" must be a number'); // Assuming Joi validation error message
    });
  });
});