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




  const transactionController = {
    name: config.controllers.transaction.name,
    path: config.controllers.transaction.path,
  };



  const transactionRepo = {
    name: config.repos.transaction.name,
    path: config.repos.transaction.path,
  };



  const transactionService = {
    name: config.services.transaction.name,
    path: config.services.transaction.path,
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [transactionSchema],
    controllers: [transactionController],
    repos: [transactionRepo],
    services: [transactionService],
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
