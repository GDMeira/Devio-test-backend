import { Prisma, PrismaClient, ProductType } from "@prisma/client";
import { faker } from '@faker-js/faker';
import { createExtras, createProducts } from '../tests/factories';

const prisma = new PrismaClient();

function generateProducts() {
  const data: Prisma.ProductUncheckedCreateInput[] = [];
  const productTypes = [ProductType.DESSERT, ProductType.DRINK, ProductType.HAMBURGUER, ProductType.SIDEDISHE];

  for (let i = 0; i < 48; i += 1) {
    const newProduct: Prisma.ProductUncheckedCreateInput = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 500, max: 9999 }),
      productType: productTypes[i % 4],
      selledTimes: faker.number.int({ min: 0, max: 9999 }),
      image: faker.image.urlLoremFlickr({ category: productTypes[i % 4], width: 480 })
    };
    data.push(newProduct);
  }

  return data;
}

function generateExtras() {
  const data: Prisma.ExtraUncheckedCreateInput[] = [];
  const productTypes = [ProductType.DESSERT, ProductType.DRINK, ProductType.HAMBURGUER, ProductType.SIDEDISHE];
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

async function main() {
  const product = await prisma.product.findFirst();

  if (!product) {
    const data = generateProducts();
    await createProducts(data);
  }

  const extra = await prisma.extra.findFirst();

  if (!extra) {
    const data = generateExtras();
    await createExtras(data);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
