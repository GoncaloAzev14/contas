/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import ITransactionController from './IControllers/ITransactionController';
import ITransactionService from '../services/IServices/ITransactionService';
import ITransactionDTO from '../dto/ITransactionDTO';

import { Result } from '../core/logic/Result';

@Service()
export default class TransactionController implements ITransactionController /* TODO: extends ../core/infra/BaseController */ {
  constructor(@Inject(config.services.transaction.name) private transactionServiceInstance: ITransactionService) {}

  public async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionOrError = (await this.transactionServiceInstance.createTransaction(req.body as ITransactionDTO)) as Result<ITransactionDTO>;

      if (transactionOrError.isFailure) {
        return res.status(402).send();
      }

      const transactionDTO = transactionOrError.getValue();
      return res.json(transactionDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionOrError = (await this.transactionServiceInstance.updateTransaction(req.body as ITransactionDTO)) as Result<ITransactionDTO>;

      if (transactionOrError.isFailure) {
        return res.status(404).send();
      }

      const transactionDTO = transactionOrError.getValue();
      return res.status(201).json(transactionDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionsOrError = (await this.transactionServiceInstance.getTransactions()) as Result<ITransactionDTO>;

      if (transactionsOrError.isFailure) {
        return res.status(404).send();
      }

      const transactionsDTO = transactionsOrError;
      return res.status(200).json(transactionsDTO);
    } catch (e) {
      return next(e);
    }
  }
}
