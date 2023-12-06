import httpStatus from 'http-status';
import { ApplicationError } from '@/protocols';

export function notFoundError(details: string): ApplicationError {
  return {
    name: 'NotFoundError',
    message: `Not found data: ${details}`,
    statusCode: httpStatus.NOT_FOUND,
  };
}
