import httpStatus from 'http-status';
import { ApplicationError } from '@/protocols';

export function unavaiable(entity: string): ApplicationError {
  return {
    name: 'Unavaiable',
    message: `${entity} is/are not avaiable.`,
    statusCode: httpStatus.BAD_REQUEST,
  };
}
