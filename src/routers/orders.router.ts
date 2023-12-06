import { getCode, postOrder } from '@/controllers';
import { validateBody } from '@/middlewares';
import { createOrderSchema } from '@/schemas';
import { Router } from 'express';

const ordersRouter = Router();

ordersRouter.get('/code', getCode);
ordersRouter.post('/', validateBody(createOrderSchema), postOrder);

export { ordersRouter };
