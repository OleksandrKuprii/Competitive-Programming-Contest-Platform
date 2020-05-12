import { actionOn, thunk } from 'easy-peasy';
import baseURL from '~/models/apiBaseURL';
import loadingModel from '~/models/loadingModel';
import User from '~/typings/entities/user';
import auth0Token from '~/models/auth0Token';
import { UserModel } from '~/typings/models';

const userModel: UserModel = {
  ...auth0Token(),
  ...loadingModel(),

  fetchMyProfile: thunk(async (actions) => {
    actions.loading();

    try {
      const token = await actions.getToken();

      const response = await fetch(`${baseURL}/profile/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { error: true };
      }

      const body = await response.json();

      const user: User = {
        signupDate: new Date(body.registered),
        username: body.nickname,
        fullname: body.name,
        picture: body.picture,
      };

      return user;
    } catch {
      return { error: true };
    }
  }),

  fetchedMyProfile: actionOn(
    (actions) => actions.fetchMyProfile.successType,
    (state, target) => {
      const user = target.result;

      if (user.error) {
        return;
      }

      state.myProfile = user;

      state.loadingStatus = false;
    },
  ),
};

export default userModel;
