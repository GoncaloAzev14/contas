import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ITransactionController from '../../controllers/IControllers/ITransactionController';

import config from '../../../config';

const route = Router();

export default (app: Router) => {
  app.use('/transaction', route);

  const ctrl = Container.get(config.controllers.transaction.name) as ITransactionController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        value: Joi.number().required(),
        date: Joi.date().required(),
        description: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.createTransaction(req, res, next),
  );

  route.put(
    '',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        value: Joi.number().required(),
        date: Joi.date().required(),
        description: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.updateTransaction(req, res, next),
  );

  route.get('', (req, res, next) => ctrl.getTransactions(req, res, next));
  route.delete('/:id', (req, res, next) => ctrl.deleteTransaction(req, res, next));
  route.delete('', (req, res, next) => ctrl.deleteAll(req, res, next));
};
