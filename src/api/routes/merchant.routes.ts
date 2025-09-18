import type { Request, Response } from 'express';
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/merchants/:id/transactions - Get all transactions for a specific merchant
router.get('/:id/transactions', async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const transactions = await prisma.transaction.findMany({
    where: {
      merchantId: id,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (transactions.length === 0) {
    return res
      .status(200)
      .send([]);
  }

  res.send(transactions);
});

module.exports = router;
