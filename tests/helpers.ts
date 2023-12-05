import { prisma } from '@/config';
import { PaidWith, ProductType } from '@prisma/client';

export async function cleanDb() {
  await Promise.all([
    prisma.product.deleteMany(),
    prisma.extra.deleteMany(),
    prisma.item.deleteMany(),
    prisma.order.deleteMany(),
  ]);
}

export const productTypes = [ProductType.DESSERT, ProductType.DRINK, ProductType.BURGUER, ProductType.SIDEDISHE];

export const paidWith = [PaidWith.CASH, PaidWith.CREDITCARD, PaidWith.DEBITCARD];
