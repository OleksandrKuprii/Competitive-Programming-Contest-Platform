import { createTypedHooks } from 'easy-peasy';
import { StoreModel } from '~/typings/models';

const typedHooks = createTypedHooks<StoreModel>();

export const { useStoreActions } = typedHooks;
export const { useStoreDispatch } = typedHooks;
export const { useStoreState } = typedHooks;
