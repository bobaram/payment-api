import type { ZodObject, ZodRawShape } from 'zod';
const { z } = require('zod');

const createTransactionSchema: ZodObject<ZodRawShape> = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().length(3),
    merchantId: z.string(),
    customerEmail: z.string().email(),
    paymentMethod: z.string().min(3),
  }),
});

const updateStatusSchema: ZodObject<ZodRawShape> = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'FLAGGED']),
  }),
  params: z.object({
    id: z.string(),
  }),
});

// Schema for the manual fraud check endpoint
const manualFraudCheckSchema: ZodObject<ZodRawShape> = z.object({
  body: z.object({
    amount: z.number().positive(),
    customerEmail: z.string().email(),
  }),
});


module.exports = {
  createTransactionSchema,
  updateStatusSchema,
  manualFraudCheckSchema,
};

