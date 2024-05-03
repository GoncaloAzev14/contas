import { Repo } from '../../core/infra/Repo';
import { Total } from '../../domain/total';
import { TotalId } from '../../domain/totalId';

export default interface ITotalRepo extends Repo<Total> {
  save(total: Total): Promise<Total>;
  findByDomainId(totalId: TotalId | string): Promise<Total>;
  findAll();
  //saveCollection (totals: Total[]): Promise<Total[]>;
  //removeByTotalIds (totals: TotalId[]): Promise<any>;
}
