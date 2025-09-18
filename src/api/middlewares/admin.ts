import type { Request, Response, NextFunction } from 'express';

// checks for a specific API key in the 'x-admin-api-key' header.
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-admin-api-key');

  if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
    return next(); 
  }

  res.status(403).send({ message: 'Forbidden: Admin access required.' });
};

module.exports = adminAuth;
