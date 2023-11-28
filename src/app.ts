import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerFile from '@/swagger/swagger_output.json';
import { handleApplicationErrors, stringStripHtml } from '@/middlewares';
import { loadEnv, connectDb, disconnectDB } from '@/config';

loadEnv();

const app = express();
app
  .use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
  .use(cors())
  .use(express.json())
  .all('/*', stringStripHtml)
  .get('/health', (_req, res) => res.send('OK!'))

  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
