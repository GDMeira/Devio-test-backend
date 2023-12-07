import { prisma } from '@/config';
import { CheckedItem, CheckedOrder } from '@/protocols';
import { OrderStatus, Prisma, PrismaClient } from '@prisma/client';

function retrieveMaxId() {
  return prisma.order.aggregate({
    _max: { id: true },
  });
}

function createOrder(order: CheckedOrder, db: PrismaClient | Prisma.TransactionClient = prisma) {
  return db.order.create({
    data: {
      clientName: order.clientName,
      paymentMethod: order.paymentMethod,
      discount: order.discount,
    },
  });
}

function createItem(item: CheckedItem, db: PrismaClient | Prisma.TransactionClient = prisma) {
  return db.item.create({
    data: item,
  });
}

function retrieveOrders() {
  return prisma.order.findMany({
    where: { orderStatus: { in: [OrderStatus.PROCESSING, OrderStatus.READY] } },
    orderBy: [
      {
        orderStatus: 'asc',
      },
      {
        createdAt: 'asc',
      },
    ],
    select: {
      id: true,
      clientName: true,
      orderStatus: true,
      itens: {
        select: {
          note: true,
          quantity: true,
          product: {
            select: {
              image: true,
              name: true,
            },
          },
          extras: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export const ordersRepository = {
  retrieveMaxId,
  createOrder,
  createItem,
  retrieveOrders,
};
