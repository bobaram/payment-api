import type { Express } from 'express';
const express = require('express');
const transactionRoutes = require('../api/routes/transaction.routes');
const merchantRoutes = require('../api/routes/merchant.routes');
const fraudRoutes = require('../api/routes/fraud.routes');
const analyticsRoutes = require('../api/routes/analytics.routes');

const setupRoutes = (app: Express) => {
  app.use(express.json());
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/merchants', merchantRoutes);
  app.use('/api/fraud-check', fraudRoutes);
  app.use('/api/analytics', analyticsRoutes);
};

module.exports = setupRoutes;

