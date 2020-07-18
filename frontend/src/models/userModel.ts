import { actionOn, thunk } from 'easy-peasy';
import baseURL from '~/models/apiBaseURL';
import loadingModel from '~/models/loadingModel';
import User from '~/typings/entities/user';
import auth0Token from '~/models/auth0Token';
import { UserModel } from '~/typings/models';
import MyProfileMeta from '~/models/myProfileMeta';

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

      const birthdayParts = body.info.birthday.split('-');

      const user: User = {
        signupDate: new Date(body.registered),
        username: body.info.nickname,
        fullname: body.info.name,
        picture: body.info.picture,
        email: body.info.email,
        birthYear: Number(birthdayParts[0]),
        birthMonth: Number(birthdayParts[1]),
        birthDay: Number(birthdayParts[2]),
        country: body.info.country,
        city: body.info.city,
        school: body.info.school,
        bio: body.info.bio
      };

      const meta: MyProfileMeta = {
        registered: body.registered,
        verifiedEmail: body.email_verified,
      };

      const tuple: [User, MyProfileMeta] = [user, meta];

      return tuple;
    } catch {
      return { error: true };
    }
  }),

  fetchedMyProfile: actionOn(
    (actions) => actions.fetchMyProfile.successType,
    (state, target) => {
      const { result } = target;

      if (result.error) {
        return;
      }

      const [user, meta] = result;

      state.myProfile = {...user};
      state.myProfileMeta = {...meta};

      state.loadingStatus = false;
    },
  ),
};

export default userModel;
