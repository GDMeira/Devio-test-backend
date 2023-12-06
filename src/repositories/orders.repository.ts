import { prisma } from '@/config';
import { CheckedItem, CheckedOrder } from '@/protocols';
import { Prisma, PrismaClient } from '@prisma/client';

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

export const ordersRepository = {
  retrieveMaxId,
  createOrder,
  createItem,
};
