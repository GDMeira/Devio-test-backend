import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { close, init } from '@/app';
import { prisma } from '@/config';
import { cleanDb } from '../helpers';

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
  it('should respond with status 201 and create the order', async () => {});
});
