import { Extra, Product } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
  statusCode: number;
};

export type ProductReturn = Omit<Product, 'createdAt' | 'updatedAt'>;

export type ProductsResponse = {
  burguers: ProductReturn[];
  desserts: ProductReturn[];
  drinks: ProductReturn[];
  sideDishes: ProductReturn[];
};

export type ExtraReturn = Omit<Extra, 'createdAt' | 'updatedAt'>;

export type ExtrasResponse = {
  burguers: ExtraReturn[];
  desserts: ExtraReturn[];
  drinks: ExtraReturn[];
  sideDishes: ExtraReturn[];
};
