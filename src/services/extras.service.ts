import { ExtraReturn, ExtrasResponse } from '@/protocols';
import { extrasRepository } from '@/repositories';
import { segregateByProductType } from '@/utils';

async function getExtras() {
  const extras: ExtraReturn[] = await extrasRepository.retrieveExtras();
  const extrasReponse: ExtrasResponse = segregateByProductType<ExtraReturn>(extras);

  return extrasReponse;
}

export const extrasServices = {
  getExtras,
};
