import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApplicationError } from '@/protocols';

export function handleApplicationErrors(
  err: ApplicationError | Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if ((err as ApplicationError).statusCode) {
    const { statusCode, message } = err as ApplicationError;

    return res.status(statusCode).send(message);
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'InternalServerError',
    message: 'Internal Server Error',
  });
}
