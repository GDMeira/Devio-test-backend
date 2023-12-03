import { ProductReturn, ProductsResponse } from '@/protocols';
import { productsRepository } from '@/repositories';
import { ProductType } from '@prisma/client';

function fitProductsResponse(products: ProductReturn[]) {
  const productsResponse: ProductsResponse = {
    burguers: [],
    desserts: [],
    drinks: [],
    sideDishes: [],
  };

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];

    switch (product.productType) {
      case ProductType.BURGUER:
        productsResponse.burguers.push(product);
        break;

      case ProductType.DESSERT:
        productsResponse.desserts.push(product);
        break;

      case ProductType.DRINK:
        productsResponse.drinks.push(product);
        break;

      case ProductType.SIDEDISHE:
        productsResponse.sideDishes.push(product);
        break;

      default:
        break;
    }
  }

  return productsResponse;
}

async function getProducts() {
  const products: ProductReturn[] = await productsRepository.retrieveProducts();
  const productsResponse: ProductsResponse = fitProductsResponse(products);

  return productsResponse;
}

export const productsService = {
  getProducts,
};
