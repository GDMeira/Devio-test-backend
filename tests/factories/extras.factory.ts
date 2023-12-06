import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { prisma, connectDb } from '../../src/config';
import { productTypes } from '../../src/utils';

connectDb();

export function generateExtras(extrasNum: number = 16) {
  const data: Prisma.ExtraUncheckedCreateInput[] = [];
  const extraType = ['Chocolate', 'juice', 'sauce', 'finger food'];

  for (let i = 0; i < extrasNum; i += 1) {
    const newExtra: Prisma.ExtraUncheckedCreateInput = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 50, max: 999 }),
      productType: productTypes[i % 4],
      image: faker.image.urlLoremFlickr({ category: extraType[i % 4], width: 480 }),
    };
    data.push(newExtra);
  }

  return data;
}

export function createExtras(data: Prisma.ExtraUncheckedCreateInput[] | undefined) {
  if (!data || data.length === 0) {
    const newData = generateExtras();
    const extras = prisma.extra.createMany({
      data: newData,
    });

    return extras;
  }

  const extras = prisma.extra.createMany({
    data,
  });

  return extras;
}

export function retrieveExtra(extraName: string) {
  return prisma.extra.findFirst({
    where: { name: extraName },
  });
}
