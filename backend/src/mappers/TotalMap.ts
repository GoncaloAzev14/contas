/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mapper } from '../core/infra/Mapper';

import { Document, Model } from 'mongoose';
import { ITotalPersistence } from '../dataschema/ITotalPersistence';

import ITotalDTO from '../dto/ITotalDTO';
import { Total } from '../domain/total';

import { UniqueEntityID } from '../core/domain/UniqueEntityID';

export class TotalMap extends Mapper<Total> {
  public static toDTO(total: Total): ITotalDTO {
    return {
      id: total.id.toString(),
      value: total.value,
    } as ITotalDTO;
  }

  public static toDomain(total: any | Model<ITotalPersistence & Document>): Total {
    const totalOrError = Total.create(total, new UniqueEntityID(total.idd));

    totalOrError.isFailure ? console.log(totalOrError.error) : '';

    return totalOrError.isSuccess ? totalOrError.getValue() : null;
  }

  public static toPersistence(total: Total): any {
    return {
      id: total.id.toString(),
      value: total.value,
    };
  }
}
