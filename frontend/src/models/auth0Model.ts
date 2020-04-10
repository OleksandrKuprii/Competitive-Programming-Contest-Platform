import { thunk, Thunk } from 'easy-peasy';
import Injections from '../injections';

export interface Auth0ModelInitialState {
  isAuthenticated: boolean,
  user: any,
  username: string,
  avatar: string,
}

export interface Auth0Model extends Auth0ModelInitialState {
  signIn: Thunk<Auth0Model, undefined, Injections>,
  signOut: Thunk<Auth0Model, undefined, Injections>,
}

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
