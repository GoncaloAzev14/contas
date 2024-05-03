/* eslint-disable prettier/prettier */
import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Guard } from "../core/logic/Guard";
import { Result } from '../core/logic/Result';
import { TotalId } from './totalId';

interface TotalProps {
  value: number;
}

export class Total extends AggregateRoot<TotalProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get totalId(): TotalId {
    return new TotalId(this.totalId.toValue());
  }

  get value(): number {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
  }

  private constructor(props: TotalProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TotalProps, id?: UniqueEntityID): Result<Total> {
    const guardedProps = [
      { argument: props.value, argumentName: 'Value' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Total>(guardResult.message);
    } else {
      const total = new Total(
        {
          ...props,
        },
        id,
      );

      if (total.value === null || total.value === undefined) total.value = props.value;

      return Result.ok<Total>(total);
    }
  }
}
