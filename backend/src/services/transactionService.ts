/* eslint-disable prettier/prettier */
import { Service, Inject } from 'typedi';
import config from '../../config';
import ITransactionDTO from '../dto/ITransactionDTO';
import { Transaction } from '../domain/transaction';
import ITransactionRepo from './IRepos/ITransactionRepo';
import ITransactionService from './IServices/ITransactionService';
import { Result } from '../core/logic/Result';
import { TransactionMap } from '../mappers/TransactionMap';

@Service()
export default class TransactionService implements ITransactionService {
  constructor(@Inject(config.repos.transaction.name) private transactionRepo: ITransactionRepo) {}

  public async getTransaction(transactionId: string): Promise<Result<ITransactionDTO>> {
    try {
      const transaction = await this.transactionRepo.findByDomainId(transactionId);

      if (transaction === null) {
        return Result.fail<ITransactionDTO>('Transaction not found');
      } else {
        const transactionDTOResult = TransactionMap.toDTO(transaction) as ITransactionDTO;
        return Result.ok<ITransactionDTO>(transactionDTOResult);
      }
    } catch (e) {
      throw e;
    }
  }

  public async createTransaction(transactionDTO: ITransactionDTO): Promise<Result<ITransactionDTO>> {
    try {
      const transactionOrError = await Transaction.create(transactionDTO);

      if (transactionOrError.isFailure) {
        return Result.fail<ITransactionDTO>(transactionOrError.errorValue());
      }

      const transactionResult = transactionOrError.getValue();

      await this.transactionRepo.save(transactionResult);

      const transactionDTOResult = TransactionMap.toDTO(transactionResult) as ITransactionDTO;
      return Result.ok<ITransactionDTO>(transactionDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async updateTransaction(transactionDTO: ITransactionDTO): Promise<Result<ITransactionDTO>> {
    try {
      const transaction = await this.transactionRepo.findByDomainId(transactionDTO.id);

      if (transaction === null) {
        return Result.fail<ITransactionDTO>('Transaction not found');
      } else {
        if (transactionDTO.description != null) transaction.description = transactionDTO.description;
        if (transactionDTO.date != null) transaction.date = transactionDTO.date;
        if (transactionDTO.value != null) transaction.value = transactionDTO.value;

        await this.transactionRepo.save(transaction);

        const transactionDTOResult = TransactionMap.toDTO(transaction) as ITransactionDTO;
        return Result.ok<ITransactionDTO>(transactionDTOResult);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getTransactions(): Promise<Result<ITransactionDTO>> {
    try {
      const transactions = await this.transactionRepo.findAll();
      return transactions;
    } catch (e) {
      throw e;
    }
  }

  public async deleteTransaction(transactionId: string): Promise<ITransactionDTO> {
    try {
      const transactionToDelete = await this.transactionRepo.findByDomainId(transactionId);
      if (transactionToDelete === null) return null;

      const transactions = await this.transactionRepo.deleteOne(transactionToDelete);
      return transactions;
    } catch (e) {
      throw e;
    }
  }

  public async deleteTransactions(): Promise<Result<ITransactionDTO>> {
    try {
      const transactions = await this.transactionRepo.deleteAll();
      return transactions;
    } catch (e) {
      throw e;
    }
  }
}
