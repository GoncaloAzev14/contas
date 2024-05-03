/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import ITotalController from './IControllers/ITotalController';
import ITotalService from '../services/IServices/ITotalService';
import ITotalDTO from '../dto/ITotalDTO';

import { Result } from '../core/logic/Result';

@Service()
export default class TotalController implements ITotalController /* TODO: extends ../core/infra/BaseController */ {
  constructor(@Inject(config.services.total.name) private totalServiceInstance: ITotalService) {}

  public async createTotal(req: Request, res: Response, next: NextFunction) {
    try {
      const totalOrError = (await this.totalServiceInstance.createTotal(req.body as ITotalDTO)) as Result<ITotalDTO>;

      if (totalOrError.isFailure) {
        return res.status(402).send();
      }

      const totalDTO = totalOrError.getValue();
      return res.json(totalDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updateTotal(req: Request, res: Response, next: NextFunction) {
    try {
      const totalOrError = (await this.totalServiceInstance.updateTotal(req.body as ITotalDTO)) as Result<ITotalDTO>;

      if (totalOrError.isFailure) {
        return res.status(404).send();
      }

      const totalDTO = totalOrError.getValue();
      return res.status(201).json(totalDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getTotal(req: Request, res: Response, next: NextFunction) {
    try {
      const totalsOrError = (await this.totalServiceInstance.getTotals()) as Result<ITotalDTO>;

      if (totalsOrError.isFailure) {
        return res.status(404).send();
      }

      const totalsDTO = totalsOrError;
      return res.status(200).json(totalsDTO);
    } catch (e) {
      return next(e);
    }
  }
}
