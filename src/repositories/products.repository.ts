import { prisma } from '@/config';
import { ProductReturn } from '@/protocols';

function retrieveProducts(): Promise<ProductReturn[]> {
  return prisma.product.findMany({
    orderBy: { selledTimes: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      discount: true,
      selledTimes: true,
      isAvaiable: true,
      productType: true,
      image: true,
    },
  });
}

export const productsRepository = {
  retrieveProducts,
};
