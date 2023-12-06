import { ReceivedItem, ReceivedOrder } from '@/protocols';
import { paidWith } from '@/utils';
import Joi from 'joi';

export const createOrderSchema = Joi.object<ReceivedOrder>({
  clientName: Joi.string().allow('').required(),
  discount: Joi.number().integer().min(0),
  paymentMethod: Joi.string()
    .valid(...paidWith)
    .required(),
  itens: Joi.array()
    .items(
      Joi.object<ReceivedItem>({
        quantity: Joi.number().integer().min(1),
        note: Joi.string().allow('').required(),
        productId: Joi.number().integer().min(1),
        extras: Joi.array().items(Joi.number().integer().min(1)).required(),
      }),
    )
    .min(1)
    .required(),
});
