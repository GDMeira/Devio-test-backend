import { Product } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
  statusCode: number;
};

export type ProductReturn = Omit<Product, 'createdAt' | 'updatedAt'>;

export type ProductsResponse = {
  burguers: Omit<ProductReturn, 'productType'>[];
  desserts: Omit<ProductReturn, 'productType'>[];
  drinks: Omit<ProductReturn, 'productType'>[];
  sideDishes: Omit<ProductReturn, 'productType'>[];
};
