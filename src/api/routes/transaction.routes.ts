import type { Request, Response } from 'express';
const express = require('express');
const { createTransactionSchema } = require('../validators/transaction.validator');
const validate = require('../middlewares/validate');
const { calculateRisk } = require('../services/fraud.service');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.post(
  '/',
  validate(createTransactionSchema),
  async (req: Request, res: Response) => {
    const { amount, currency, merchantId, customerEmail, paymentMethod } =
      req.body;

    // 1. Perform fraud check
    const { riskScore, isFlagged } = await calculateRisk({
      amount,
      customerEmail,
    });

    // 2. Determine transaction status based on fraud check
    const status = isFlagged ? 'FLAGGED' : 'COMPLETED';

    // 3. Save the transaction to the database
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

    // 4. Send the created transaction as the response
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

module.exports = router;

