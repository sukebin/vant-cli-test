import { apice } from '../config/api';

export type SmApice = typeof apice | undefined;
export const getApi = (smApice: SmApice) => {
  const newApice: SmApice = smApice || apice;
  return newApice;
};
