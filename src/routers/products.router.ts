import { getProducts } from '@/controllers';
import { Router } from 'express';

const productsRouter = Router();

productsRouter.get('/', getProducts);

export { productsRouter };
