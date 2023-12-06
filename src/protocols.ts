import { Extra, PaidWith, Prisma, Product } from '@prisma/client';

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

export type ReceivedItem = {
  productId: number;
  extras: number[];
  quantity: number;
  note: string;
};

export type ReceivedOrder = {
  itens: ReceivedItem[];
  clientName: string;
  discount?: number;
  paymentMethod: PaidWith;
};

// export type CheckedItem = {
//   productId: number;
//   extras: number[];
//   quantity: number;
//   note: string;
//   paidPrice: number;
// };

export type CheckedItem = Prisma.ItemUncheckedCreateInput;

export type CheckedOrder = {
  clientName: string;
  discount: number;
  paymentMethod: PaidWith;
};
