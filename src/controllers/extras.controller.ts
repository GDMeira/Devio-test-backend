import { extrasServices } from '@/services';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getExtras(_req: Request, res: Response) {
  const extras = await extrasServices.getExtras();

  res.status(httpStatus.OK).send(extras);
}
