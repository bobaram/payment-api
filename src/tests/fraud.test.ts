const request = require('supertest');
const { app } = require('../server'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Fraud API', () => {
  // Clean the database before each test
  beforeEach(async () => {
    await prisma.transaction.deleteMany({});
  });

  // Clean up and disconnect Prisma after all tests
  afterAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/fraud-check', () => {
    it('should return a low risk score for a normal transaction', async () => {
      const response = await request(app)
        .post('/api/fraud-check')
        .send({
          amount: 100,
          customerEmail: 'low.risk@example.com',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.isFlagged).toBe(false);
      expect(response.body.riskScore).toBe(0);
    });

    it('should return a high risk score and flag a suspicious transaction', async () => {
      // Seed a transaction that will trigger the fraud rule
      await prisma.transaction.create({
        data: {
          amount: 1500, // High amount triggers the rule
          currency: 'USD',
          merchantId: 'merch_risk',
          customerEmail: 'high.risk@example.com',
          paymentMethod: 'card',
          status: 'PENDING',
        },
      });

      const response = await request(app)
        .post('/api/fraud-check')
        .send({
          amount: 1500,
          customerEmail: 'high.risk@example.com',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.isFlagged).toBe(true);
      expect(response.body.riskScore).toBeGreaterThanOrEqual(50);
    });

    it('should return 400 for invalid input data', async () => {
      const response = await request(app)
        .post('/api/fraud-check')
        .send({
          customerEmail: 'onlyemail@example.com',
        });

      expect(response.statusCode).toBe(400);
    });
  });
});
