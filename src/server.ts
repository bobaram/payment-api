const dotenv = require('dotenv');

// Load environment variables based on the current environment
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

import type { Express, Request, Response } from 'express';
const express = require('express');
const helmet = require('helmet');
const setupRoutes = require('./startup/routes');

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
setupRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Payment API is up and running!');
});

let server: any;

// Only start the server if this file is run directly
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

module.exports = { app, server };

