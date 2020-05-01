export type UserModel =
  | {
      username: string;
      guest: false;
    }
  | {
      guest: true;
    };

const userModel: UserModel = {
  guest: true,
};

export default userModel;
