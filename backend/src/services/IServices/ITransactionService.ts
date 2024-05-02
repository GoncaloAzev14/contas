import { Result } from '../../core/logic/Result';
import ITransactionDTO from '../../dto/ITransactionDTO';

export default interface ITransactionService {
  createTransaction(transactionDTO: ITransactionDTO): Promise<Result<ITransactionDTO>>;
  updateTransaction(transactionDTO: ITransactionDTO): Promise<Result<ITransactionDTO>>;
  getTransactions(): Promise<Result<ITransactionDTO>>;
}
