const { z } = require('zod');

const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().length(3),
    merchantId: z.string().uuid(),
    customerEmail: z.string().email(),
    paymentMethod: z.string().min(1),
  }),
});

module.exports = { createTransactionSchema };

