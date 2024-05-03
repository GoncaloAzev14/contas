/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import transactionSchema from '../persistence/schemas/transactionSchema';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const transactionSchema = {
    name: 'transactionSchema',
    schema: '../persistence/schemas/transactionSchema',
  };

  const totalSchema = {
    name: 'totalSchema',
    schema: '../persistence/schemas/totalSchema',
  };



  const totalController = {
    name: config.controllers.total.name,
    path: config.controllers.total.path,
  };

  const transactionController = {
    name: config.controllers.transaction.name,
    path: config.controllers.transaction.path,
  };



  const transactionRepo = {
    name: config.repos.transaction.name,
    path: config.repos.transaction.path,
  };

  const totalRepo = {
    name: config.repos.total.name,
    path: config.repos.total.path,
  };



  const transactionService = {
    name: config.services.transaction.name,
    path: config.services.transaction.path,
  };

  const totalService = {
    name: config.services.total.name,
    path: config.services.total.path,
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [transactionSchema, totalSchema],
    controllers: [transactionController, totalController],
    repos: [transactionRepo, totalRepo],
    services: [transactionService, totalService],
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
