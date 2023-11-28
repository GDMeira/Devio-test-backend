import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { invalidDataError } from '@/errors';

function validate(schema: ObjectSchema, type: 'body' | 'params' | 'query') {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[type], {
      abortEarly: false,
    });

    if (!error) {
      next();
    } else {
      const errorMessage = error.details.map(d => d.message).join('\n');
      throw invalidDataError(errorMessage);
    }
  };
}

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, 'body');
}

export function validateParams<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, 'params');
}

export function validateQueryParams<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, 'query');
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;
