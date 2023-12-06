import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { prisma, connectDb } from '../../src/config';
import { productTypes } from '../../src/utils';

connectDb();

export function generateProducts(productsNum: number = 48) {
  const data: Prisma.ProductUncheckedCreateInput[] = [];

  for (let i = 0; i < productsNum; i += 1) {
    const newProduct: Prisma.ProductUncheckedCreateInput = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 500, max: 9999 }),
      productType: productTypes[i % 4],
      selledTimes: faker.number.int({ min: 0, max: 9999 }),
      image: faker.image.urlLoremFlickr({ category: productTypes[i % 4], width: 480 }),
    };
    data.push(newProduct);
  }

  return data;
}

export function createProducts(data: Prisma.ProductUncheckedCreateInput[] | undefined) {
  if (!data || data.length === 0) {
    const newData = generateProducts();
    const products = prisma.product.createMany({
      data: newData,
    });

    return products;
  }

  const products = prisma.product.createMany({
    data,
  });

  return products;
}

export function retrieveProduct(productName: string) {
  return prisma.product.findFirst({
    where: { name: productName },
  });
}
