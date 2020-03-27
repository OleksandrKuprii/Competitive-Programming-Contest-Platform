import { createTypedHooks } from 'easy-peasy';
import { StoreModel } from '../models/store';

const typedHooks = createTypedHooks<StoreModel>();

export const { useStoreActions } = typedHooks;
export const { useStoreDispatch } = typedHooks;
export const { useStoreState } = typedHooks;
