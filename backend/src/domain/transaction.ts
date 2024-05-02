/* eslint-disable prettier/prettier */
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from "../core/logic/Guard";
import { Result } from '../core/logic/Result';
import { TransactionId } from './transactionId';

interface TransactionProps {
  value: number;
  date: Date;
  description: string;
}

export class Transaction extends AggregateRoot<TransactionProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get transactionId(): TransactionId {
    return new TransactionId(this.transactionId.toValue());
  }

  get value(): number {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
  }

  get date(): Date {
    return this.props.date;
  }

  set date(date: Date) {
    this.props.date = date;
  }

  get description(): string {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  private constructor(props: TransactionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TransactionProps, id?: UniqueEntityID): Result<Transaction> {
    const guardedProps = [
      { argument: props.value, argumentName: 'Name' },
      { argument: props.date, argumentName: 'Date' },
      { argument: props.description, argumentName: 'Description' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Transaction>(guardResult.message);
    } else {
      const transaction = new Transaction(
        {
          ...props,
        },
        id,
      );

      if (transaction.value === null || transaction.value === undefined) transaction.value = props.value;
      if (transaction.date === null || transaction.date === undefined) transaction.date = props.date;
      if (transaction.description === null || transaction.description === undefined)
        transaction.description = props.description;

      return Result.ok<Transaction>(transaction);
    }
  }
}
