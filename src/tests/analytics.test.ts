const request = require('supertest');
const { app } = require('../server'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Analytics API', () => {
  // Clean up the database after all tests
  afterAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.$disconnect();
  });

  // Clear transactions before each test to ensure a clean slate
  beforeEach(async () => {
    await prisma.transaction.deleteMany({});
  });

  describe('GET /api/analytics/flagged', () => {
    it('should return a summary of flagged transactions', async () => {
      await prisma.transaction.createMany({
        data: [
          { amount: 1200, currency: 'USD', merchantId: 'merch_analytics', customerEmail: 'flag1@example.com', paymentMethod: 'card', status: 'FLAGGED', riskScore: 50 },
          { amount: 800, currency: 'USD', merchantId: 'merch_analytics', customerEmail: 'ok1@example.com', paymentMethod: 'card', status: 'COMPLETED' },
          { amount: 1500, currency: 'USD', merchantId: 'merch_analytics', customerEmail: 'flag2@example.com', paymentMethod: 'card', status: 'FLAGGED', riskScore: 50 },
        ],
      });

      const response = await request(app).get('/api/analytics/flagged');

      expect(response.statusCode).toBe(200);
      expect(response.body.totalFlaggedCount).toBe(2);
      expect(response.body.totalFlaggedValue).toBe(2700);
      expect(response.body).toHaveProperty('lastFlaggedTransaction');
    });

    it('should return a zero-value summary when there are no flagged transactions', async () => {
      await prisma.transaction.create({
        data: { amount: 100, currency: 'USD', merchantId: 'merch_analytics', customerEmail: 'ok2@example.com', paymentMethod: 'card', status: 'COMPLETED' },
      });

      const response = await request(app).get('/api/analytics/flagged');

      expect(response.statusCode).toBe(200);
      expect(response.body.totalFlaggedCount).toBe(0);
      expect(response.body.totalFlaggedValue).toBe(0);
      expect(response.body.lastFlaggedTransaction).toBeNull();
    });
  });
});
