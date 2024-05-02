/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mapper } from '../core/infra/Mapper';

import { Document, Model } from 'mongoose';
import { ITransactionPersistence } from '../dataschema/ITransactionPersistence';

import ITransactionDTO from '../dto/ITransactionDTO';
import { Transaction } from '../domain/transaction';

import { UniqueEntityID } from '../core/domain/UniqueEntityID';

export class TransactionMap extends Mapper<Transaction> {
  public static toDTO(transaction: Transaction): ITransactionDTO {
    return {
      id: transaction.id.toString(),
      value: transaction.value,
      date: transaction.date,
      description: transaction.description,
    } as ITransactionDTO;
  }

  public static toDomain(transaction: any | Model<ITransactionPersistence & Document>): Transaction {
    const transactionOrError = Transaction.create(transaction, new UniqueEntityID(transaction.domainId));

    transactionOrError.isFailure ? console.log(transactionOrError.error) : '';

    return transactionOrError.isSuccess ? transactionOrError.getValue() : null;
  }

  public static toPersistence(transaction: Transaction): any {
    return {
      domainId: transaction.id.toString(),
      value: transaction.value,
      date: transaction.date,
      description: transaction.description,
    };
  }
}
