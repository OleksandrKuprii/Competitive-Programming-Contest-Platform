import createAuth0Client from '@auth0/auth0-spa-js';
// eslint-disable-next-line
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import {
  Action, Thunk, thunk, action,
} from 'easy-peasy';
import loadingModel, { LoadingModel } from './loadingModel';


export interface Auth0Model {
  isAuthenticated: boolean
  client?: Auth0Client
  loading: LoadingModel,

  userPicture?: string
  username?: string
  token?: string,

  changedAuthenticatedStatus: Action<Auth0Model, boolean>
  changedUser: Action<Auth0Model, { picture?: string, name: string, token: string }>
  createdClient: Action<Auth0Model, Auth0Client>
  doAuth: Action<Auth0Model, {redirectUri?: string}>,
  logout: Action<Auth0Model>,

  init: Thunk<Auth0Model, Auth0ClientOptions>,
}

const auth0Model: Auth0Model = {
  isAuthenticated: false,
  loading: loadingModel(),

  createdClient: action((state, client) => {
    // eslint-disable-next-line
    state.client = client;
  }),

  changedAuthenticatedStatus: action((state, isAuthenticated) => {
    // eslint-disable-next-line
    state.isAuthenticated = isAuthenticated;
  }),

  changedUser: action((state, { picture, name, token }) => {
    if (picture !== undefined) {
      // eslint-disable-next-line
      state.userPicture = picture;
    } else {
      // eslint-disable-next-line
      state.userPicture = undefined;
    }

    // eslint-disable-next-line
    state.username = name;

    // eslint-disable-next-line
    state.token = token;
  }),

  init: thunk(async (actions, initOptions) => {
    actions.loading.changedLoadingStatus(true);

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

      const token = await auth0FromHook.getTokenSilently();

      actions.changedUser({
        picture: user.picture,
        name: user.given_name,
        token,
      });
    }

    actions.loading.changedLoadingStatus(false);
  }),

  doAuth: action((state) => {
    state.client?.loginWithRedirect({
      redirect_uri: window.location.href,
    }).then();
  }),

  logout: action((state) => {
    state.client?.logout();
  }),
};

export default auth0Model;
