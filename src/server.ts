import type { Express, Request, Response } from 'express';
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const setupRoutes = require('./startup/routes');

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

// API Routes
setupRoutes(app);

// Health check endpoint
app.get('/', (req: Request, res: Response) =>
  res.send('Payment API is up and running!')
);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

module.exports = { app };

