import {ProfileModel} from "~/typings/models";

interface User extends ProfileModel {
  signupDate: Date;
  picture: string;
}

export default User;
