const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// payload for the risk calculation
type FraudCheckPayload = {
  amount: number;
  customerEmail: string;
};

const calculateRisk = async (payload: FraudCheckPayload) => {
  let riskScore = 0;

  // Rule 1: High transaction amount
  if (payload.amount > 1000) {
    riskScore += 50;
  }

  // Rule 2: High frequency of transactions from the same customer
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentTransactions = await prisma.transaction.count({
    where: {
      customerEmail: payload.customerEmail,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentTransactions > 5) {
    riskScore += 50;
  }

  // Determine if the transaction should be flagged
  const isFlagged = riskScore >= 75;

  return { riskScore, isFlagged };
};

module.exports = { calculateRisk };

