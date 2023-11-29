import { productsService } from '@/services';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getProducts(_req: Request, res: Response) {
  const products = await productsService.getProducts();

  res.status(httpStatus.OK).send(products);
}
