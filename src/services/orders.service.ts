import { ordersRepository } from '@/repositories';

async function getCode(): Promise<number> {
  const maxId = await ordersRepository.retrieveMaxId();

  // eslint-disable-next-line no-underscore-dangle
  if (!maxId._max.id) return 1;

  // eslint-disable-next-line no-underscore-dangle
  return maxId._max.id + 1;
}

export const ordersService = {
  getCode,
};
