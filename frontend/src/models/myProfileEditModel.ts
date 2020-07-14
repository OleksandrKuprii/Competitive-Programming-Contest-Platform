import { MyProfileEditModel } from '~/typings/models';
import {action} from "easy-peasy";

const myProfileEditModel: MyProfileEditModel = {
  onUsernameChange: action((state, value) => {
    state.username = value;
  }),

  onFullnameChange: action((state, value) => {
    state.fullname = value;
  }),
};

export default myProfileEditModel;
