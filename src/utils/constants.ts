import { ProductType } from '@prisma/client';

interface ItemWithProductType {
  productType: ProductType;
}

export function segregateByProductType<T extends ItemWithProductType>(data: T[]) {
  type ResponseType = {
    burguers: T[];
    desserts: T[];
    drinks: T[];
    sideDishes: T[];
  };

  const response: ResponseType = {
    burguers: [],
    desserts: [],
    drinks: [],
    sideDishes: [],
  };

  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];

    switch (item.productType) {
      case ProductType.BURGUER:
        response.burguers.push(item);
        break;

      case ProductType.DESSERT:
        response.desserts.push(item);
        break;

      case ProductType.DRINK:
        response.drinks.push(item);
        break;

      case ProductType.SIDEDISHE:
        response.sideDishes.push(item);
        break;

      default:
        break;
    }
  }

  return response;
}
