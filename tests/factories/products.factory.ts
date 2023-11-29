import { faker } from '@faker-js/faker';
import { Prisma, ProductType } from '@prisma/client';
import { prisma, connectDb } from '../../src/config';

connectDb();

function generateProducts() {
  const data: Prisma.ProductUncheckedCreateInput[] = [];
  const productTypes = [ProductType.DESSERT, ProductType.DRINK, ProductType.BURGUER, ProductType.SIDEDISHE];

  for (let i = 0; i < 48; i += 1) {
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

    return prisma.extra.createMany({
      data: newData,
    });
  }

  return prisma.product.createMany({
    data,
  });
}
