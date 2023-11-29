import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { close, init } from '@/app';
import { ProductReturn } from '@/protocols';
import { cleanDb } from '../helpers';
import { createProducts } from '../factories';

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

describe('GET /products', () => {
  it('should respond with status 200', async () => {
    await createProducts([]);
    const response = await server.get('/products');

    type ExpectedProductShape = Omit<ProductReturn, 'productType'>;
    const expectedProductShape: ExpectedProductShape = {
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      discount: expect.any(Number),
      isAvaiable: expect.any(Boolean),
      selledTimes: expect.any(Number),
      image: expect.any(String),
    };

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toMatchObject({
      burguers: expect.arrayContaining([expect.objectContaining<ExpectedProductShape>(expectedProductShape)]),
      desserts: expect.arrayContaining([expect.objectContaining<ExpectedProductShape>(expectedProductShape)]),
      drinks: expect.arrayContaining([expect.objectContaining<ExpectedProductShape>(expectedProductShape)]),
      sideDishes: expect.arrayContaining([expect.objectContaining<ExpectedProductShape>(expectedProductShape)]),
    });
  });
});
