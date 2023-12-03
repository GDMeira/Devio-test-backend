import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { close, init } from '@/app';
import { ExtraReturn } from '@/protocols';
import { cleanDb } from '../helpers';
import { createExtras } from '../factories';

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

describe('GET /extras', () => {
  it('should respond with status 200 and an object with arrays of extras for each product type', async () => {
    await createExtras([]);
    const response = await server.get('/extras');

    type ExpectedProductShape = ExtraReturn;
    const expectedProductShape: ExpectedProductShape = {
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      discount: expect.any(Number),
      isAvaiable: expect.any(Boolean),
      image: expect.any(String),
      productType: expect.any(String),
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
