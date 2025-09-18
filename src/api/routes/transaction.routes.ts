import type { Request, Response } from 'express';
const express = require('express');
const {
  createTransactionSchema,
  updateStatusSchema,
} = require('../validators/transaction.validator');
const validate = require('../middlewares/validate');
const adminAuth = require('../middlewares/admin');
const { calculateRisk } = require('../services/fraud.service');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/transactions - Create a new transaction
router.post(
  '/',
  validate(createTransactionSchema),
  async (req: Request, res: Response) => {
    const { amount, currency, merchantId, customerEmail, paymentMethod } =
      req.body;

    const { riskScore, isFlagged } = await calculateRisk({
      amount,
      customerEmail,
    });

    const status = isFlagged ? 'FLAGGED' : 'COMPLETED';

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        currency,
        merchantId,
        customerEmail,
        paymentMethod,
        status,
        riskScore,
      },
    });

    res.status(201).send(transaction);
  }
);

// GET /api/transactions/:id - Get a specific transaction by its ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    return res
      .status(404)
      .send({ message: 'The transaction with the given ID was not found.' });
  }

  res.send(transaction);
});

// GET /api/transactions - List all transactions with pagination
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const transactions = await prisma.transaction.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.send(transactions);
});

// PUT /api/transactions/:id/status - Update a transaction's status (Admin only)
router.put(
  '/:id/status',
  [adminAuth, validate(updateStatusSchema)],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: { status },
      });

      res.send(updatedTransaction);
    } catch (error) {
      // Prisma throws an error if the record to update is not found
      return res
        .status(404)
        .send({ message: 'The transaction with the given ID was not found.' });
    }
  }
);

module.exports = router;

