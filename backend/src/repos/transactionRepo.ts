/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import ITransactionRepo from '../services/IRepos/ITransactionRepo';
import { Transaction } from '../domain/transaction';
import { TransactionId } from '../domain/transactionId';
import { TransactionMap } from '../mappers/TransactionMap';
import ITransactionDTO from '../dto/ITransactionDTO'

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

    const query = { id: idX };
    const transactionDocument = await this.transactionSchema.findOne(
      query as FilterQuery<ITransactionPersistence & Document>,
    );

    return !!transactionDocument === true;
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    const query = { id: transaction.id.toString() };
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
    const query = { id: transactionId };
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

  public async deleteOne(transaction: Transaction) {
    try {
      const criteria = { id: transaction.id };
      console.log("criteria:   ", criteria);
      return await this.transactionSchema.deleteOne(criteria);
    } catch (e) {
      throw e;
    }
  }

  public async deleteAll() {
    try {
      return await this.transactionSchema.deleteMany();
    } catch (e) {
      throw e;
    }
  }
}
