import { Result } from '../../core/logic/Result';
import ITotalDTO from '../../dto/ITotalDTO';

export default interface ITotalService {
  createTotal(totalDTO: ITotalDTO): Promise<Result<ITotalDTO>>;
  updateTotal(totalDTO: ITotalDTO): Promise<Result<ITotalDTO>>;
  getTotals(): Promise<Result<ITotalDTO>>;
}
