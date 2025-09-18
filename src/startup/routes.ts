import type { Express } from 'express';
const express = require('express');
const transactionRoutes = require('../api/routes/transaction.routes');

const setupRoutes = (app: Express) => {
  app.use(express.json());

  //  application routes 
  app.use('/api/transactions', transactionRoutes);

};

module.exports = setupRoutes;
