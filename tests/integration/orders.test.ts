import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { close, init } from '@/app';
import { prisma } from '@/config';
import { faker } from '@faker-js/faker';
import { cleanDb } from '../helpers';
import { generateItens, generateOrder } from '../factories';

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
