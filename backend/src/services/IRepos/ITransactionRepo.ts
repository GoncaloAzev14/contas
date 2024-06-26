/* eslint-disable prettier/prettier */
import { Repo } from '../../core/infra/Repo';
import { Transaction } from '../../domain/transaction';
import { TransactionId } from '../../domain/transactionId';

export default interface ITransactionRepo extends Repo<Transaction> {
  save(transaction: Transaction): Promise<Transaction>;
  findByDomainId(transactionId: TransactionId | string): Promise<Transaction>;
  findAll();
  deleteOne(transaction: Transaction);
  deleteAll();
  //saveCollection (transactions: Transaction[]): Promise<Transaction[]>;
  //removeByTransactionIds (transactions: TransactionId[]): Promise<any>;
}
