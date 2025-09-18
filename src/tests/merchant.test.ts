const request = require('supertest');
const { app } = require('../server'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Merchant API', () => {
  // Clean up the database after all tests
  afterAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.$disconnect();
  });

  // Set up test data before each test
  beforeEach(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.transaction.createMany({
      data: [
        {
          amount: 100,
          currency: 'USD',
          merchantId: 'merchant_a',
          customerEmail: 'cust1@a.com',
          paymentMethod: 'card',
          status: 'COMPLETED',
        },
        {
          amount: 200,
          currency: 'USD',
          merchantId: 'merchant_a',
          customerEmail: 'cust2@a.com',
          paymentMethod: 'card',
          status: 'FLAGGED',
        },
        {
          amount: 50,
          currency: 'USD',
          merchantId: 'merchant_b',
          customerEmail: 'cust1@b.com',
          paymentMethod: 'card',
          status: 'COMPLETED',
        },
      ],
    });
  });

  describe('GET /api/merchants/:id/transactions', () => {
    it('should return all transactions for a specific merchant', async () => {
      const response = await request(app).get('/api/merchants/merchant_a/transactions');
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach((tx: any) => {
        expect(tx.merchantId).toBe('merchant_a');
      });
    });

    it('should return an empty array for a merchant with no transactions', async () => {
      const response = await request(app).get('/api/merchants/merchant_c/transactions');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should respect pagination for merchant transactions', async () => {
        const response = await request(app).get('/api/merchants/merchant_a/transactions?page=1&limit=1');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });
  });
});
