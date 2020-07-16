import { MyProfileEditModel } from '~/typings/models';
import {action, thunk} from "easy-peasy";
import baseURL from "~/models/apiBaseURL";
import auth0Token from "~/models/auth0Token";

const myProfileEditModel: MyProfileEditModel = {
  ...auth0Token(),

  onUsernameChange: action((state, value) => {
    state.username = value;
  }),

  onFullnameChange: action((state, value) => {
    state.fullname = value;
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

  onSave: thunk(async (actions, _, { getState }) => {
    try {
      const token = await actions.getToken();

      const {username, fullname} = getState();

      const response = await fetch(`${baseURL}/profile/my`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          fullname
        })
      });

      const body = await response.json();

      console.log(body);
    } catch {
      return { error: true };
    }
  }),
};

export default myProfileEditModel;
