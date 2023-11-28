import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { close, init } from '@/app';

const server = supertest(app);

beforeAll(async () => {
  await init();
});

afterAll(async () => {
  await close();
});

describe('GET /health', () => {
  it('should respond with status 200', async () => {
    const response = await server.get('/health');

    expect(response.status).toBe(httpStatus.OK);
  });
});
