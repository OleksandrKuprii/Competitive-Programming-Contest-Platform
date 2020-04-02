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

  changedLoadingStatus: Action<Auth0Model, boolean>
  changedAuthenticatedStatus: Action<Auth0Model, boolean>
  changedUser: Action<Auth0Model, { picture?: string, name: string }>
  createdClient: Action<Auth0Model, Auth0Client>
  doAuth: Action<Auth0Model, {redirectUri?: string}>,
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

  changedUser: action((state, { picture, name }) => {
    const newState = { ...state, username: name };

    if (picture !== undefined) {
      newState.userPicture = picture;
    } else {
      newState.userPicture = undefined;
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
      window.history.replaceState({},
        document.title, window.location.pathname + window.location.hash);
    }

    const isAuthenticated = await auth0FromHook.isAuthenticated();

    actions.changedAuthenticatedStatus(isAuthenticated);

    if (isAuthenticated) {
      const user = await auth0FromHook.getUser();

      actions.changedUser({ picture: user.picture, name: user.given_name });
    }

    actions.changedLoadingStatus(false);
  }),

  doAuth: action((state, { redirectUri = window.location.href }) => {
    state.client?.loginWithRedirect({ redirect_uri: redirectUri }).then();
  }),

  logout: action((state) => {
    state.client?.logout();
  }),
};

export default auth0Model;
