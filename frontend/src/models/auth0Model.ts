import { action, thunk } from 'easy-peasy';
import loadingModel from '~/models/loadingModel';
import { Auth0Model } from '~/typings/models';

const auth0Model: Auth0Model = {
  ...loadingModel(),

  loadingStatus: true,

  isAuthenticated: false,

  createdClient: action((state, client) => {
    state.client = client;
  }),

  authenticated: action((state) => {
    state.isAuthenticated = true;
  }),

  signIn: thunk((actions, _, { getState }) => {
    const { client } = getState();

    if (!client) {
      return;
    }

    client.loginWithRedirect({
      redirect_uri: window.location.href,
    });
  }),

  signOut: thunk((actions, _, { getState }) => {
    const { client } = getState();

    if (!client) {
      return;
    }

    client.logout();
  }),
};

export default auth0Model;
