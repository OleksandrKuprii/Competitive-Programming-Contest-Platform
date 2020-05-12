import { persist } from 'easy-peasy';
import { MyProfileEditModel } from '~/typings/models';

const myProfileEditModel: MyProfileEditModel = persist({
  editing: false,

  fullname: undefined,
});

export default myProfileEditModel;
