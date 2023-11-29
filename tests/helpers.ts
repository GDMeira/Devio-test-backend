import { prisma } from '@/config';

export async function cleanDb() {
  await Promise.all([
    prisma.product.deleteMany(),
    prisma.extra.deleteMany(),
    prisma.itensInOrders.deleteMany(),
    prisma.item.deleteMany(),
    prisma.order.deleteMany(),
  ]);
}
