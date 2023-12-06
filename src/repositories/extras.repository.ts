import { prisma } from '@/config';
import { ExtraReturn } from '@/protocols';

function retrieveExtras(): Promise<ExtraReturn[]> {
  return prisma.extra.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      discount: true,
      isAvaiable: true,
      productType: true,
      image: true,
    },
  });
}

function retrieveExtrasByIds(extrasId: number[]): Promise<ExtraReturn[]> {
  return prisma.extra.findMany({
    where: { id: { in: extrasId } },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      discount: true,
      isAvaiable: true,
      productType: true,
      image: true,
    },
  });
}

export const extrasRepository = {
  retrieveExtras,
  retrieveExtrasByIds,
};
