import { getCode } from '@/controllers';
import { Router } from 'express';

const ordersRouter = Router();

ordersRouter.get('/code', getCode);

export { ordersRouter };
