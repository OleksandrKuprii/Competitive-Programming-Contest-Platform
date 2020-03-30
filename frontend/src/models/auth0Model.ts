import createAuth0Client from '@auth0/auth0-spa-js';
// eslint-disable-next-line
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import {
  Action, Thunk, thunk, action,
} from 'easy-peasy';


export interface Auth0Model {
  isAuthenticated: boolean
  client?: Auth0Client
  userPicture?: string
  loading: boolean

  changedLoadingStatus: Action<Auth0Model, boolean>
  changedAuthenticatedStatus: Action<Auth0Model, boolean>
  changedUserPicture: Action<Auth0Model, string>
  createdClient: Action<Auth0Model, Auth0Client>
  doAuth: Action<Auth0Model>,
  logout: Action<Auth0Model>,

  init: Thunk<Auth0Model, Auth0ClientOptions>,
}

const auth0Model: Auth0Model = {
  isAuthenticated: false,
  loading: false,

  changedLoadingStatus: action((state, loading) => ({
    ...state,
    loading,
  })),

  createdClient: action((state, client) => ({
    ...state,
    client,
  })),

  changedAuthenticatedStatus: action((state, isAuthenticated) => ({
    ...state,
    isAuthenticated,
  })),

  changedUserPicture: action((state, userPicture) => ({
    ...state,
    userPicture,
  })),

  init: thunk(async (actions, initOptions) => {
    actions.changedLoadingStatus(true);

    const auth0FromHook = await createAuth0Client(initOptions);

    actions.createdClient(auth0FromHook);

    if (window.location.search.includes('code=')
    && window.location.search.includes('state=')) {
      await auth0FromHook.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const isAuthenticated = await auth0FromHook.isAuthenticated();

    actions.changedAuthenticatedStatus(isAuthenticated);

    if (isAuthenticated) {
      const user = await auth0FromHook.getUser();
      actions.changedUserPicture(user.picture);
    }

    actions.changedLoadingStatus(false);
  }),

  doAuth: action((state) => {
    state.client?.loginWithRedirect();
  }),

  logout: action((state) => {
    state.client?.logout();
  }),
};

export default auth0Model;
