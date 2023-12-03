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

export const extrasRepository = {
  retrieveExtras,
};
