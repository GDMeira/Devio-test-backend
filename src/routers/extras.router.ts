import { getExtras } from '@/controllers';
import { Router } from 'express';

const extrasRouter = Router();

extrasRouter.get('/', getExtras);

export { extrasRouter };
