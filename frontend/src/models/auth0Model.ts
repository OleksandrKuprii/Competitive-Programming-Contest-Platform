import createAuth0Client from '@auth0/auth0-spa-js';
// eslint-disable-next-line
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import {
  Action, Thunk, thunk, action,
} from 'easy-peasy';


export interface Auth0Model {
  isAuthenticated: boolean
  client?: Auth0Client
  loading: boolean

  userPicture?: string
  username?: string

  idToken?: string

  changedLoadingStatus: Action<Auth0Model, boolean>
  changedAuthenticatedStatus: Action<Auth0Model, boolean>
  changedUser: Action<Auth0Model, { picture?: string, name: string, idToken: string }>
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

  changedUser: action((state, { picture, name, idToken }) => {
    const newState = { ...state, userName: name, idToken };

    if (picture !== undefined) {
      newState.userPicture = picture;
    }

    return newState;
  }),

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

      const idToken = await auth0FromHook.getTokenSilently();

      actions.changedUser({ picture: user.picture, name: user.given_name, idToken });
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
