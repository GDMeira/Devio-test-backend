import { ReceivedOrder } from '@/protocols';
import { ordersService } from '@/services';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getCode(_req: Request, res: Response) {
  const code = await ordersService.getCode();

  res.status(httpStatus.OK).send({ code });
}

export async function postOrder(req: Request, res: Response) {
  const order = req.body as ReceivedOrder;
  await ordersService.postOrder(order);

  res.sendStatus(httpStatus.CREATED);
}
