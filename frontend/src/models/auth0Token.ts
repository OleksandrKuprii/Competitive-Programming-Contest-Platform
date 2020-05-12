import { thunk } from 'easy-peasy';
import { Auth0Token } from '~/typings/models';

const auth0Token: () => Auth0Token = () => ({
  getToken: thunk((actions, _, { getStoreState }) =>
    getStoreState().auth0.client?.getTokenSilently(),
  ),
});

export default auth0Token;
