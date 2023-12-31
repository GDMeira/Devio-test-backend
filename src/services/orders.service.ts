import { prisma } from '@/config';
import { notFoundError, conflictOrderPatch, unavaiable } from '@/errors';
import { CheckedItem, CheckedOrder, ReceivedItem, ReceivedOrder } from '@/protocols';
import { extrasRepository, ordersRepository, productsRepository } from '@/repositories';
import { OrderStatus } from '@prisma/client';

async function getCode(): Promise<number> {
  const maxId = await ordersRepository.retrieveMaxId();

  // eslint-disable-next-line no-underscore-dangle
  if (!maxId._max.id) return 1;

  // eslint-disable-next-line no-underscore-dangle
  return maxId._max.id + 1;
}

async function checkItens(itens: ReceivedItem[], orderId: number): Promise<CheckedItem[]> {
  const checkedItens: CheckedItem[] = [];

  for (let i = 0; i < itens.length; i += 1) {
    const item = itens[i];

    // eslint-disable-next-line no-await-in-loop
    const product = await productsRepository.retrieveProductById(item.productId);
    let extras;

    if (!product) throw notFoundError('product');
    if (!product.isAvaiable) throw unavaiable(`Product (${product.name})`);

    if (item.extras.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      extras = await extrasRepository.retrieveExtrasByIds(item.extras);
      const unavaiableExtras = extras.filter(extra => !extra.isAvaiable);

      if (!extras || extras.length < item.extras.length) throw notFoundError('extras');
      if (unavaiableExtras.length > 0)
        throw unavaiable(`Extras (${unavaiableExtras.map(extra => extra.name).join(', ')})`);
    }

    let paidPrice = product.price - product.discount;

    if (item.extras.length > 0) {
      extras.forEach(extra => {
        paidPrice += extra.price - extra.discount;
      });
    }

    const newItem: CheckedItem = {
      productId: item.productId,
      note: item.note,
      orderId,
      paidPrice: item.quantity * paidPrice,
      extras: { connect: item.extras.map(extraId => ({ id: extraId })) },
    };

    checkedItens.push(newItem);
  }

  return checkedItens;
}

async function checkOrder(order: ReceivedOrder): Promise<CheckedOrder> {
  const discount = order.discount || 0;
  const checkedOrder: CheckedOrder = { ...order, discount };

  return checkedOrder;
}

async function postOrder(order: ReceivedOrder) {
  const checkedOrder: CheckedOrder = await checkOrder(order);

  const createdOrder = await prisma.$transaction(async tx => {
    const orderTx = await ordersRepository.createOrder(checkedOrder, tx);
    const checkedItens: CheckedItem[] = await checkItens(order.itens, orderTx.id);
    const itensPromisses = [];

    for (let i = 0; i < checkedItens.length; i += 1) {
      itensPromisses.push(ordersRepository.createItem(checkedItens[i], tx));
    }

    await Promise.all(itensPromisses);

    return orderTx;
  });

  return createdOrder;
}

async function getOrders() {
  const orders = await ordersRepository.retrieveOrders();
  type SegregatedOrders = {
    processing: typeof orders;
    ready: typeof orders;
  };

  const segregatedOrders: SegregatedOrders = { processing: [], ready: [] };

  orders.forEach(order => {
    if (order.orderStatus === OrderStatus.PROCESSING) {
      segregatedOrders.processing.push(order);
    } else {
      segregatedOrders.ready.push(order);
    }
  });

  return segregatedOrders;
}

async function validateOrder(orderId: number) {
  const orderDB = await ordersRepository.retrieveOrderById(orderId);

  if (!orderDB) {
    throw notFoundError('order');
  }
  if (orderDB.orderStatus === OrderStatus.CANCELED || orderDB.orderStatus === OrderStatus.DELIVERED) {
    throw conflictOrderPatch(orderDB.orderStatus);
  }
}

async function patchOrder(newStatus: OrderStatus, orderId: number) {
  await validateOrder(orderId);
  await ordersRepository.updateOrderStatus(newStatus, orderId);
}

export const ordersService = {
  getCode,
  postOrder,
  getOrders,
  patchOrder,
};
