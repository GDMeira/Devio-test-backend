import { Product } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
  statusCode: number;
};

export type ProductReturn = Omit<Product, 'createdAt' | 'updatedAt'>;
