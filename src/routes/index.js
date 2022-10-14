import express from 'express';
import incomes from './incomesRoutes.js';
import expenses from './expensesRoutes.js';
import summary from './summaryRoutes.js';

const routes = (app) => {
  app.route('/').get((req, res) => {
    res.status(200).send('Welcome to Personal Finance API');
  });

  app.use(
    express.json(),
    incomes,
    expenses,
    summary,
  );
};

export default routes;
