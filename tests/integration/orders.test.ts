import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { close, init } from '@/app';
import { prisma } from '@/config';
import { faker } from '@faker-js/faker';
import { OrderStatus } from '@prisma/client';
import { cleanDb } from '../helpers';
import { createOneOrder, createOrder, generateItens, generateOrder } from '../factories';

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await close();
});

describe('GET /orders/code', () => {
  it('should respond with status 200 and the code of next order', async () => {
    const code = await prisma.order.aggregate({
      _max: { id: true },
    });

    const response = await server.get('/orders/code');

    expect(response.status).toBe(httpStatus.OK);
    // eslint-disable-next-line no-underscore-dangle
    expect(response.body).toEqual({ code: code._max.id || 1 });
  });
});

describe('POST /orders', () => {
  it('should respond with status 201 and create the order', async () => {
    const itens = await generateItens();
    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.CREATED);
  });

  it('should respond with status 422 if there is no item', async () => {
    const itens: [] = [];
    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 if some item has a quantity equal to or less than 0', async () => {
    const numberOfItens = 5;
    const itens = await generateItens(5);
    itens[faker.number.int({ min: 0, max: numberOfItens - 1 })].quantity = faker.number.int({ min: -10, max: 0 });
    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 if the paymentMethod is not allowed', async () => {
    const itens = await generateItens();
    const order = {
      itens,
      clientName: faker.person.firstName(),
      paymentMethod: faker.lorem.word(),
    };

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 if there are ids in itens less than or equal to 0', async () => {
    const numberOfItens = 5;
    const itens = await generateItens(5);
    itens[faker.number.int({ min: 0, max: numberOfItens - 1 })].productId = faker.number.int({ min: -10, max: 0 });
    itens[faker.number.int({ min: 0, max: numberOfItens - 1 })].extras[0] = faker.number.int({ min: -10, max: 0 });

    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 404 if product does not exist', async () => {
    const itens = await generateItens();
    itens[0].productId += 1000;
    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if extra does not exist', async () => {
    const itens = await generateItens();
    itens[0].extras[0] += 1000;
    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 400 if a product is unavaiable', async () => {
    const itens = await generateItens();
    await prisma.product.update({
      where: { id: itens[0].productId },
      data: { isAvaiable: false },
    });
    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if a product is unavaiable', async () => {
    const itens = await generateItens();
    await prisma.extra.update({
      where: { id: itens[0].extras[0] },
      data: { isAvaiable: false },
    });
    const order = generateOrder(itens);

    const response = await server.post('/orders').send(order);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
});

describe('GET /orders', () => {
  it('should respond with status 200 and the orders with status processing or ready', async () => {
    await createOrder();

    const response = await server.get('/orders');

    type Product = {
      name: string;
      image: string;
    };

    type Extra = {
      name: string;
    };

    type Item = {
      note: string | null;
      quantity: number;
      product: Product;
      extras: Extra[];
    };

    type ExpectedOrderShape = {
      id: number;
      clientName: string;
      orderStatus: string;
      itens: Item[];
    };

    const expectedOrderShape: ExpectedOrderShape = {
      id: expect.any(Number),
      clientName: expect.any(String),
      orderStatus: expect.any(String),
      itens: expect.arrayContaining([
        expect.objectContaining<Item>({
          note: expect.any(String),
          quantity: expect.any(Number),
          product: expect.objectContaining<Product>({
            name: expect.any(String),
            image: expect.any(String),
          }),
          extras: expect.arrayContaining([
            expect.objectContaining<Extra>({
              name: expect.any(String),
            }),
          ]),
        }),
      ]),
    };

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      processing: expect.arrayContaining([expect.objectContaining<ExpectedOrderShape>(expectedOrderShape)]),
      ready: expect.arrayContaining([expect.objectContaining<ExpectedOrderShape>(expectedOrderShape)]),
    });
  });
});

describe('PATCH /orders/:orderId', () => {
  it('should respond with status 204 and update the order status to ready', async () => {
    const order = await createOneOrder(OrderStatus.PROCESSING);
    const newStatus = OrderStatus.READY;

    const response = await server.patch(`/orders/${order.id}`).send({ newStatus });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(response.status).toBe(httpStatus.NO_CONTENT);
    expect(updatedOrder.orderStatus).toBe(newStatus);
  });

  it('should respond with status 204 and update the order status to canceld', async () => {
    const order = await createOneOrder(OrderStatus.PROCESSING);
    const newStatus = OrderStatus.CANCELED;

    const response = await server.patch(`/orders/${order.id}`).send({ newStatus });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(response.status).toBe(httpStatus.NO_CONTENT);
    expect(updatedOrder.orderStatus).toBe(newStatus);
  });

  it('should respond with status 204 and update the order status to delivered', async () => {
    const order = await createOneOrder(OrderStatus.PROCESSING);
    const newStatus = OrderStatus.DELIVERED;

    const response = await server.patch(`/orders/${order.id}`).send({ newStatus });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(response.status).toBe(httpStatus.NO_CONTENT);
    expect(updatedOrder.orderStatus).toBe(newStatus);
  });

  it('should respond with status 404 if the order does not exist', async () => {
    const order = await createOneOrder(OrderStatus.PROCESSING);
    const newStatus = OrderStatus.DELIVERED;

    const response = await server.patch(`/orders/${order.id + 1}`).send({ newStatus });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 422 if the new status is not valid', async () => {
    const order = await createOneOrder(OrderStatus.PROCESSING);
    const newStatus = faker.lorem.word();

    const response = await server.patch(`/orders/${order.id}`).send({ newStatus });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(updatedOrder.orderStatus).toBe(order.orderStatus);
  });

  it('should respond with status 422 if the orderId is not valid', async () => {
    const order = await createOneOrder(OrderStatus.PROCESSING);
    const newStatus = OrderStatus.READY;

    const response = await server.patch(`/orders/${faker.number.float({ min: -100, max: 0 })}`).send({ newStatus });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(updatedOrder.orderStatus).toBe(order.orderStatus);
  });

  it('should respond with status 401 if the order is already delivered', async () => {
    const order = await createOneOrder(OrderStatus.DELIVERED);
    const newStatus = OrderStatus.READY;

    const response = await server.patch(`/orders/${order.id}`).send({ newStatus });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(updatedOrder.orderStatus).toBe(order.orderStatus);
  });

  it('should respond with status 401 if the order is already canceled', async () => {
    const order = await createOneOrder(OrderStatus.CANCELED);
    const newStatus = OrderStatus.READY;

    const response = await server.patch(`/orders/${order.id}`).send({ newStatus });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(updatedOrder.orderStatus).toBe(order.orderStatus);
  });
});
