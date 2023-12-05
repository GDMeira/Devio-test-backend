import { prisma } from '@/config';

function retrieveMaxId() {
  return prisma.order.aggregate({
    _max: { id: true },
  });
}

export const ordersRepository = {
  retrieveMaxId,
};
