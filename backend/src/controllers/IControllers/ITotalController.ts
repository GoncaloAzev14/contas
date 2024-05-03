import { Request, Response, NextFunction } from 'express';

export default interface ITotalController {
  createTotal(req: Request, res: Response, next: NextFunction);
  updateTotal(req: Request, res: Response, next: NextFunction);
  getTotal(req: Request, res: Response, next: NextFunction);
}
