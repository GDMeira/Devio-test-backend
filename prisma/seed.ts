import { Prisma, PrismaClient, ProductType } from "@prisma/client";
import { faker } from '@faker-js/faker';
import { createExtras, createProducts } from '../tests/factories';

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst();

  if (!product) {
    await createProducts([]);
  }

  const extra = await prisma.extra.findFirst();

  if (!extra) {
    await createExtras([]);
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
