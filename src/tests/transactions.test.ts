const request = require('supertest');
const { app } = require('../server'); // remove `server`
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Transactions API', () => {
  // Clean up the database after all tests
  afterAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.$disconnect();
  });

  // Clean the database before each test
  beforeEach(async () => {
    await prisma.transaction.deleteMany({});
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction and return 201', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send({
          amount: 150.75,
          currency: 'USD',
          merchantId: 'merch_12345',
          customerEmail: 'test.user@example.com',
          paymentMethod: 'credit_card',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(150.75);
    });

    it('should return 400 for invalid request data', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send({
          amount: -50,
          currency: 'US',
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('should fetch a single transaction by its ID', async () => {
      const newTransaction = await prisma.transaction.create({
        data: {
          amount: 99.99,
          currency: 'EUR',
          merchantId: 'merch_67890',
          customerEmail: 'fetch.test@example.com',
          paymentMethod: 'debit_card',
          status: 'COMPLETED',
        },
      });

      const response = await request(app).get(
        `/api/transactions/${newTransaction.id}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(newTransaction.id);
    });
  });
});
