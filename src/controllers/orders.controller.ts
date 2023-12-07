import { ReceivedOrder } from '@/protocols';
import { ordersService } from '@/services';
import { OrderStatus } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getCode(_req: Request, res: Response) {
  const code = await ordersService.getCode();

  res.status(httpStatus.OK).send({ code });
}

export async function postOrder(req: Request, res: Response) {
  const order = req.body as ReceivedOrder;
  const createdOrder = await ordersService.postOrder(order);

  res.status(httpStatus.CREATED).send({ code: createdOrder.id });
}

export async function getOrders(_req: Request, res: Response) {
  const orders = await ordersService.getOrders();

  res.status(httpStatus.OK).send(orders);
}

export async function patchOrder(req: Request, res: Response) {
  const newStatus = req.body.newStatus as OrderStatus;
  const radix = 10;
  const orderId = parseInt(req.params.orderId, radix);
  await ordersService.patchOrder(newStatus, orderId);

  res.sendStatus(httpStatus.NO_CONTENT);
}
