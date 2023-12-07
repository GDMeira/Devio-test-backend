import httpStatus from 'http-status';
import { ApplicationError } from '@/protocols';

export function conflictOrderPatch(status: string): ApplicationError {
  return {
    name: 'ConflictOrderPatch',
    message: `Order is already ${status}`,
    statusCode: httpStatus.CONFLICT,
  };
}
