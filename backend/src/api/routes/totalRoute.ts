import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ITotalController from '../../controllers/IControllers/ITotalController';

import config from '../../../config';

const route = Router();

export default (app: Router) => {
  app.use('/total', route);

  const ctrl = Container.get(config.controllers.total.name) as ITotalController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        value: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.createTotal(req, res, next),
  );

  route.put(
    '',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        value: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.updateTotal(req, res, next),
  );

  route.get('', (req, res, next) => ctrl.getTotal(req, res, next));
};
