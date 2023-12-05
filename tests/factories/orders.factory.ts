import { faker } from '@faker-js/faker';
import { PaidWith } from '@prisma/client';
import { connectDb } from '../../src/config';
import { createExtras, generateExtras, retrieveExtra } from './extras.factory';
import { createProducts, generateProducts, retrieveProduct } from './products.factory';
import { paidWith } from '../helpers';

connectDb();

type ReceivedItem = {
  productId: number;
  extras: number[];
  quantity: number;
  note: string;
};

type ReceivedOrder = {
  itens: ReceivedItem[];
  clientName: string;
  discount?: number;
  paymentMethod: PaidWith;
};

export async function generateItens(itensNum: number = 3) {
  const itens: ReceivedItem[] = [];

  const extraData = generateExtras();
  const productsData = generateProducts();

  await Promise.all([createExtras(extraData), createProducts(productsData)]);

  for (let i = 0; i < itensNum; i += 1) {
    const selectedProduct = productsData[faker.number.int({ min: 0, max: productsData.length - 1 })];
    const selectedExtra = extraData.find(extra => extra.productType === selectedProduct.productType);

    // eslint-disable-next-line no-await-in-loop
    const [productDB, extraDB] = await Promise.all([
      retrieveProduct(selectedProduct.name),
      retrieveExtra(selectedExtra.name),
    ]);

    const newItem: ReceivedItem = {
      productId: productDB.id,
      extras: [extraDB.id],
      quantity: faker.number.int({ min: 1, max: 5 }),
      note: faker.lorem.words(),
    };
    itens.push(newItem);
  }

  return itens;
}

export function generateOrder(itens: ReceivedItem[] | []) {
  const order: ReceivedOrder = {
    itens,
    clientName: faker.person.firstName(),
    paymentMethod: paidWith[faker.number.int({ min: 1, max: paidWith.length - 1 })],
  };

  return order;
}
