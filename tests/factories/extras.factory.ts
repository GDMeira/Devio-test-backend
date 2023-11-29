import { Prisma, ProductType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { prisma, connectDb } from '../../src/config';

connectDb();

function generateExtras() {
  const data: Prisma.ExtraUncheckedCreateInput[] = [];
  const productTypes = [ProductType.DESSERT, ProductType.DRINK, ProductType.BURGUER, ProductType.SIDEDISHE];
  const extraType = ['Chocolate', 'juice', 'sauce', 'finger food'];

  for (let i = 0; i < 16; i += 1) {
    const newProduct: Prisma.ExtraUncheckedCreateInput = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 50, max: 999 }),
      productType: productTypes[i % 4],
      image: faker.image.urlLoremFlickr({ category: extraType[i % 4], width: 480 }),
    };
    data.push(newProduct);
  }

  return data;
}

export function createExtras(data: Prisma.ExtraUncheckedCreateInput[] | undefined) {
  if (!data || data.length === 0) {
    const newData = generateExtras();

    return prisma.extra.createMany({
      data: newData,
    });
  }

  return prisma.extra.createMany({
    data,
  });
}
