import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).send({ message: error.message });
      }
      return res.status(400).send({ message: 'Validation error' });
    }
  };

module.exports = validate;

