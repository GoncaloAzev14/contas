import { Router } from 'express';
import transaction from './routes/transactionRoute';

export default () => {
  const app = Router();

  transaction(app);

  return app;
};
