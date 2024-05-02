import { Request, Response, NextFunction } from 'express';

export default interface ITransactionController {
  createTransaction(req: Request, res: Response, next: NextFunction);
  updateTransaction(req: Request, res: Response, next: NextFunction);
  getTransactions(req: Request, res: Response, next: NextFunction);
}
