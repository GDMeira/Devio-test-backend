import { getCode, getOrders, patchOrder, postOrder } from '@/controllers';
import { validateBody, validateParams } from '@/middlewares';
import { createOrderSchema, patchOrderBodySchema, patchOrderParamsSchema } from '@/schemas';
import { Router } from 'express';

const ordersRouter = Router();

ordersRouter.get('/code', getCode);
ordersRouter.post('/', validateBody(createOrderSchema), postOrder);
ordersRouter.get('/', getOrders);
ordersRouter.patch('/:orderId', validateBody(patchOrderBodySchema), validateParams(patchOrderParamsSchema), patchOrder);

export { ordersRouter };
