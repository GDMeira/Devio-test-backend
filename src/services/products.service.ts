import { ProductReturn, ProductsResponse } from '@/protocols';
import { productsRepository } from '@/repositories';
import { segregateByProductType } from '@/utils/constants';

async function getProducts() {
  const products: ProductReturn[] = await productsRepository.retrieveProducts();
  const productsResponse: ProductsResponse = segregateByProductType<ProductReturn>(products);

  return productsResponse;
}

export const productsService = {
  getProducts,
};
