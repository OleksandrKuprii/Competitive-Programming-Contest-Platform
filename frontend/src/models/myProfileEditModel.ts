import {MyProfileEditModel} from '~/typings/models';
import {action, actionOn, computed, thunk, thunkOn} from "easy-peasy";
import baseURL from "~/models/apiBaseURL";
import auth0Token from "~/models/auth0Token";
import User from "~/typings/entities/user";
import loadingModel from "~/models/loadingModel";

function prependZero(num: number) {
  return ('0' + num).slice(-2);
}


function isoFormat(year: number, month: number, day: number) {
  return `${year}-${prependZero(month)}-${prependZero(day)}`;
}

const myProfileEditModel: MyProfileEditModel = {
  ...loadingModel(),
  ...auth0Token(),

  onEmailChange: action((state, value) => {
    state.email = value;
  }),

  onUsernameChange: action((state, value) => {
    state.username = value;
  }),

  onFullnameChange: action((state, value) => {
    state.fullname = value;
  }),

  onCountryChange: action((state, value) => {
    state.country = value;
  }),

  onCityChange: action((state, value) => {
    state.city = value;
  }),

  onSchoolChange: action((state, value) => {
    state.school = value;
  }),

  onBirthDayChange: action((state, value) => {
    state.birthDay = value;
  }),

  onBirthMonthChange: action((state, value) => {
    state.birthMonth = value;
  }),

  onBirthYearChange: action((state, value) => {
    state.birthYear = value;
  }),

  onBioChange: action((state, value) => {
    state.bio = value;
  }),

  onSave: thunk(async (actions, _, {getState}) => {
    actions.loading();

    try {
      const token = await actions.getToken();

      const {
        username, fullname, email,
        birthDay, birthMonth, birthYear,
        country, city, school,
        bio,
      } = getState();

      await fetch(`${baseURL}/profile/my`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: username,
          name: fullname,
          email,
          birthday: (birthDay && birthMonth && birthYear) ? isoFormat(birthYear, birthMonth, birthDay) : undefined,
          country,
          city,
          school,
          bio,
        })
      });
    } catch {
      return {error: true};
    }
  }),

  onSaved: thunkOn(
    (actions) => actions.onSave.successType,
    async (actions, target, { getStoreActions }) => {
      actions.loaded();

      await getStoreActions().user.fetchMyProfile();
    }
  ),

  onFetchedMyProfile: actionOn(
    (actions, storeActions) => storeActions.user.fetchMyProfile.successType,
    (state, target) => {
      const {result} = target;

      if (result.error) {
        return;
      }

      const [user, _]: [User, any] = result;

      state.username = user.username;
      state.fullname = user.fullname;
      state.email = user.email;

      state.birthDay = user.birthDay;
      state.birthMonth = user.birthMonth;
      state.birthYear = user.birthYear;

      state.country = user.country;
      state.city = user.city;
      state.school = user.school;

      state.bio = user.bio;
    }
  ),

  edited: computed([
    ({ username, fullname, email, school, country, birthYear, birthMonth, birthDay, bio, city }) =>
      ({ username, fullname, email, school, country, birthYear, birthMonth, birthDay, bio, city }),
    (state, storeState) => storeState.user.myProfile
  ], (editData, profileData) => (
    !profileData ||
    Object.entries(editData).some(([key, value]) => value !== (profileData as any)[key])
  ))
};

export default myProfileEditModel;
