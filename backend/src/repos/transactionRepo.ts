/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service, Inject } from 'typedi';

import ITransactionRepo from '../services/IRepos/ITransactionRepo';
import { Transaction } from '../domain/transaction';
import { TransactionId } from '../domain/transactionId';
import { TransactionMap } from '../mappers/TransactionMap';

import { Document, FilterQuery, Model } from 'mongoose';
import { ITransactionPersistence } from '../dataschema/ITransactionPersistence';

@Service()
export default class TransactionRepo implements ITransactionRepo {
  private models: any;

  constructor(@Inject('transactionSchema') private transactionSchema: Model<ITransactionPersistence & Document>) {}

  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(transaction: Transaction): Promise<boolean> {
    const idX = transaction.id instanceof TransactionId ? (<TransactionId>transaction.id).toValue() : transaction.id;

    const query = { domainId: idX };
    const transactionDocument = await this.transactionSchema.findOne(
      query as FilterQuery<ITransactionPersistence & Document>,
    );

    return !!transactionDocument === true;
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    const query = { domainId: transaction.id.toString() };

    const transactionDocument = await this.transactionSchema.findOne(query);

    try {
      if (transactionDocument === null) {
        const rawTransaction: any = TransactionMap.toPersistence(transaction);

        const transactionCreated = await this.transactionSchema.create(rawTransaction);

        return TransactionMap.toDomain(transactionCreated);
      } else {
        transactionDocument.value = transaction.value;
        transactionDocument.date = transaction.date;
        transactionDocument.description = transaction.description;
        await transactionDocument.save();

        return transaction;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(transactionId: TransactionId | string): Promise<Transaction> {
    const query = { domainId: transactionId };
    const transactionRecord = await this.transactionSchema.findOne(
      query as FilterQuery<ITransactionPersistence & Document>,
    );

    if (transactionRecord != null) {
      return TransactionMap.toDomain(transactionRecord);
    } else return null;
  }

  public async findAll() {
    try {
      return await this.transactionSchema.find();
    } catch (e) {
      throw e;
    }
  }
}
