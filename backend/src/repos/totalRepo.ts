/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service, Inject } from 'typedi';

import ITotalRepo from '../services/IRepos/ITotalRepo';
import { Total } from '../domain/total';
import { TotalId } from '../domain/totalId';
import { TotalMap } from '../mappers/TotalMap';

import { Document, FilterQuery, Model } from 'mongoose';
import { ITotalPersistence } from '../dataschema/ITotalPersistence';

@Service()
export default class TotalRepo implements ITotalRepo {
  private models: any;

  constructor(@Inject('totalSchema') private totalSchema: Model<ITotalPersistence & Document>) {}

  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(total: Total): Promise<boolean> {
    const idX = total.id instanceof TotalId ? (<TotalId>total.id).toValue() : total.id;

    const query = { id: idX };
    const totalDocument = await this.totalSchema.findOne(query as FilterQuery<ITotalPersistence & Document>);

    return !!totalDocument === true;
  }

  public async save(total: Total): Promise<Total> {
    const query = { id: total.id.toString() };

    const totalDocument = await this.totalSchema.findOne(query);

    try {
      if (totalDocument === null) {
        const rawTotal: any = TotalMap.toPersistence(total);

        const totalCreated = await this.totalSchema.create(rawTotal);

        return TotalMap.toDomain(totalCreated);
      } else {
        totalDocument.value = total.value;
        await totalDocument.save();

        return total;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(totalId: TotalId | string): Promise<Total> {
    const query = { id: totalId };
    const totalRecord = await this.totalSchema.findOne(query as FilterQuery<ITotalPersistence & Document>);

    if (totalRecord != null) {
      return TotalMap.toDomain(totalRecord);
    } else return null;
  }

  public async findAll() {
    try {
      return await this.totalSchema.find();
    } catch (e) {
      throw e;
    }
  }
}
