import { Prisma } from '@prisma/client';
import { prisma, connectDb } from '../../src/config';

connectDb();

export function createProducts(data: Prisma.ProductUncheckedCreateInput[]) {
  return prisma.product.createMany({
    data,
  });
}
