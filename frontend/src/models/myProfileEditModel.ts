import { persist } from 'easy-peasy';
import { MyProfileEditModel } from '~/models/interfaces';

const myProfileEditModel: MyProfileEditModel = persist({
  editing: false,

  fullname: undefined,
});

export default myProfileEditModel;
