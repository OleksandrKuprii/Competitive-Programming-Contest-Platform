import { thunk } from 'easy-peasy';
import { Auth0Model, Auth0ModelInitialState } from './interfaces';

const auth0Model: (initialState: Auth0ModelInitialState) => Auth0Model = (initialState) => ({
  ...initialState,
  signIn: thunk(async (actions, payload, { injections }) => {
    await injections.auth0.loginWithRedirect({
      redirect_uri: window.location.href,
    });
  }),
  signOut: thunk(async (actions, payload, { injections }) => {
    injections.auth0.logout();
  }),
});

export default auth0Model;
