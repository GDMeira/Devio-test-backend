import { faker } from '@faker-js/faker';
import { ReceivedItem, ReceivedOrder } from '@/protocols';
import { OrderStatus } from '@prisma/client';
import { connectDb, prisma } from '../../src/config';
import { createExtras, generateExtras, retrieveExtra } from './extras.factory';
import { createProducts, generateProducts, retrieveProduct } from './products.factory';
import { paidWith } from '../../src/utils';

connectDb();

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

export async function createItens(orderId: number, itensNum: number = 3) {
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

    const quantity = faker.number.int({ min: 1, max: 5 });

    // eslint-disable-next-line no-await-in-loop
    await prisma.item.create({
      data: {
        quantity,
        note: faker.lorem.words(),
        paidPrice: quantity * (productDB.price - productDB.discount + extraDB.price - extraDB.discount),
        orderId,
        productId: productDB.id,
        extras: { connect: { id: extraDB.id } },
      },
    });
  }
}

export async function createOrder(orderNum: number = 3) {
  for (let i = 0; i < orderNum; i += 1) {
    const orderData = generateOrder([]);
    const orderStatus = i > 0 ? OrderStatus.PROCESSING : OrderStatus.READY;

    // eslint-disable-next-line no-await-in-loop
    const order = await prisma.order.create({
      data: {
        clientName: orderData.clientName,
        paymentMethod: orderData.paymentMethod,
        orderStatus,
      },
    });

    // eslint-disable-next-line no-await-in-loop
    await createItens(order.id, faker.number.int({ min: 1, max: 3 }));
  }
}

export async function createOneOrder(orderStatus: OrderStatus = OrderStatus.PROCESSING) {
  const orderData = generateOrder([]);

  // eslint-disable-next-line no-await-in-loop
  const order = await prisma.order.create({
    data: {
      clientName: orderData.clientName,
      paymentMethod: orderData.paymentMethod,
      orderStatus,
    },
  });

  // eslint-disable-next-line no-await-in-loop
  await createItens(order.id, faker.number.int({ min: 1, max: 3 }));

  return order;
}
