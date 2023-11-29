import { Prisma } from '@prisma/client';
import { prisma, connectDb } from '../../src/config';

connectDb();

export function createExtras(data: Prisma.ExtraUncheckedCreateInput[]) {
  return prisma.extra.createMany({
    data,
  });
}
