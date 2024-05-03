import { Router } from 'express';
import transaction from './routes/transactionRoute';
import total from './routes/totalRoute';

export default () => {
  const app = Router();

  transaction(app);
  total(app);

  return app;
};
