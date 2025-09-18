import type { Request, Response, NextFunction } from 'express';
import type { AnyZodObject } from 'zod';
const { ZodError } = require('zod');

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error :any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: error.errors,
      });
    }
    // Handle other unexpected errors
    next(error);
  }
};

module.exports = { validate };

