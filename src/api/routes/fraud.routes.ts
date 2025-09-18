import type { Request, Response } from 'express';
const express = require('express');
const { manualFraudCheckSchema } = require('../validators/transaction.validator');
const validate = require('../middlewares/validate');
const { calculateRisk } = require('../services/fraud.service');

const router = express.Router();

// POST /api/fraud-check - Manually check a transaction for fraud risk
router.post(
  '/',
  validate(manualFraudCheckSchema),
  async (req: Request, res: Response) => {
    const { amount, customerEmail } = req.body;

    const { riskScore, isFlagged } = await calculateRisk({
      amount,
      customerEmail,
    });

    res.status(200).send({
      riskScore,
      isFlagged,
      message: 'Fraud risk assessment complete.',
    });
  }
);

module.exports = router;
