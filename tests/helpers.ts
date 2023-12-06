import { prisma } from '@/config';

export async function cleanDb() {
  await prisma.item.deleteMany();
  await prisma.order.deleteMany();
  await Promise.all([prisma.product.deleteMany(), prisma.extra.deleteMany()]);
}
