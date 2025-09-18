import type { Request, Response } from 'express';
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/analytics/flagged - Get a summary of flagged transactions
router.get('/flagged', async (req: Request, res: Response) => {
  // Count the total number of flagged transactions
  const totalFlagged = await prisma.transaction.count({
    where: {
      status: 'FLAGGED',
    },
  });

  // Find the most recent flagged transaction
  const mostRecentFlagged = await prisma.transaction.findFirst({
    where: {
      status: 'FLAGGED',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate the total value of all flagged transactions
  const totalValueResult = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: 'FLAGGED',
    },
  });

  res.status(200).send({
    totalFlaggedCount: totalFlagged,
    totalFlaggedValue: totalValueResult._sum.amount || 0,
    lastFlaggedTransaction: mostRecentFlagged,
  });
});

module.exports = router;
