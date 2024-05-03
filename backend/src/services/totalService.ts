import { Service, Inject } from 'typedi';
import config from '../../config';
import ITotalDTO from '../dto/ITotalDTO';
import { Total } from '../domain/total';
import ITotalRepo from './IRepos/ITotalRepo';
import ITotalService from './IServices/ITotalService';
import { Result } from '../core/logic/Result';
import { TotalMap } from '../mappers/TotalMap';

@Service()
export default class TotalService implements ITotalService {
  constructor(@Inject(config.repos.total.name) private totalRepo: ITotalRepo) {}

  public async getTotal(totalId: string): Promise<Result<ITotalDTO>> {
    try {
      const total = await this.totalRepo.findByDomainId(totalId);

      if (total === null) {
        return Result.fail<ITotalDTO>('Total not found');
      } else {
        const totalDTOResult = TotalMap.toDTO(total) as ITotalDTO;
        return Result.ok<ITotalDTO>(totalDTOResult);
      }
    } catch (e) {
      throw e;
    }
  }

  public async createTotal(totalDTO: ITotalDTO): Promise<Result<ITotalDTO>> {
    try {
      const totalOrError = await Total.create(totalDTO);

      if (totalOrError.isFailure) {
        return Result.fail<ITotalDTO>(totalOrError.errorValue());
      }

      const totalResult = totalOrError.getValue();

      await this.totalRepo.save(totalResult);

      const totalDTOResult = TotalMap.toDTO(totalResult) as ITotalDTO;
      return Result.ok<ITotalDTO>(totalDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async updateTotal(totalDTO: ITotalDTO): Promise<Result<ITotalDTO>> {
    try {
      const total = await this.totalRepo.findByDomainId(totalDTO.id);

      if (total === null) {
        return Result.fail<ITotalDTO>('Total not found');
      } else {
        total.value = totalDTO.value;
        await this.totalRepo.save(total);

        const totalDTOResult = TotalMap.toDTO(total) as ITotalDTO;
        return Result.ok<ITotalDTO>(totalDTOResult);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getTotals(): Promise<Result<ITotalDTO>> {
    try {
      const totals = await this.totalRepo.findAll();
      return totals;
    } catch (e) {
      throw e;
    }
  }
}
