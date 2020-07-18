import * as React from 'react';
import {FC, useCallback} from "react";
import Page from "@/toucanui/templates/page";
import TextField from "@/toucanui/atoms/textField/singleLine";
import {Col, Grid, Row} from "@/toucanui/atoms/grid";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Alert from "@/molecules/alert";
import {useStoreState, useStoreActions} from "~/hooks/store";
import TextFieldMultiLine from "@/toucanui/atoms/textField/multiLine";


const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

const selectOptions = months.map(month => ({
  label: month[0].toUpperCase() + month.substr(1),
  value: month,
}));


const EditProfilePage: FC = () => {
  const registered = useStoreState(state => state.user.myProfileMeta?.registered);
  const verifiedEmail = useStoreState(state => state.user.myProfileMeta?.verifiedEmail);

  const email = useStoreState(state => state.myProfileEdit.email);
  const username = useStoreState(state => state.myProfileEdit.username);
  const fullname = useStoreState(state => state.myProfileEdit.fullname);

  const country = useStoreState(state => state.myProfileEdit.country);
  const city = useStoreState(state => state.myProfileEdit.city);
  const school = useStoreState(state => state.myProfileEdit.school);

  const birthDay = useStoreState(state => state.myProfileEdit.birthDay);
  const birthMonth = useStoreState(state => state.myProfileEdit.birthMonth);
  const birthYear = useStoreState(state => state.myProfileEdit.birthYear);

  const bio = useStoreState(state => state.myProfileEdit.bio);

  const onEmailChange = useStoreActions(actions => actions.myProfileEdit.onEmailChange);
  const onUsernameChange = useStoreActions(actions => actions.myProfileEdit.onUsernameChange);
  const onFullnameChange = useStoreActions(actions => actions.myProfileEdit.onFullnameChange);

  const onCountryChange = useStoreActions(actions => actions.myProfileEdit.onCountryChange);
  const onCityChange = useStoreActions(actions => actions.myProfileEdit.onCityChange);
  const onSchoolChange = useStoreActions(actions => actions.myProfileEdit.onSchoolChange);

  const onBirthDayChange = useStoreActions(actions => actions.myProfileEdit.onBirthDayChange);
  const onBirthMonthChange = useStoreActions(actions => actions.myProfileEdit.onBirthMonthChange);
  const onBirthYearChange = useStoreActions(actions => actions.myProfileEdit.onBirthYearChange);

  const onBioChange = useStoreActions(actions => actions.myProfileEdit.onBioChange);

  return (
    <Page>
      <Grid style={{width: 500, margin: 'auto'}}>
        {!verifiedEmail && <Alert title="Email verification" subtitle="Email isn't verified" variant="warning"/>}
        {!registered && <Alert title="Registration completion"
               subtitle="Fill out the fields below and click 'Save' to complete the registration" variant="info"/>}

        <Row>
          <TextField label="Email" value={email} onChange={onEmailChange as any}/>

          <Spacer left={Padding.Normal}/>

          <TextField label="Username" value={username} onChange={onUsernameChange as any}/>
        </Row>

        <TextField label="Fullname" value={fullname} onChange={onFullnameChange as any}/>

        <Row>
          <TextField label="Day" value={birthDay} onChange={onBirthDayChange as any} type="number"/>

          <Spacer left={Padding.Normal}/>

          <TextField label="Month" value={birthMonth} onChange={onBirthMonthChange as any} type="number"/>

          <Spacer left={Padding.Normal}/>

          <TextField label="Year" value={birthYear} onChange={onBirthYearChange as any} type="number"/>
        </Row>

        <Row>
          <TextField label="Country" onChange={onCountryChange as any} value={country} />

          <Spacer left={Padding.Normal}/>

          <TextField label="City" onChange={onCityChange as any} value={city} />
        </Row>

        <TextField label="School/University" onChange={onSchoolChange as any} value={school} />

        <TextFieldMultiLine label="Bio" onChange={onBioChange} value={bio} />
      </Grid>
    </Page>
  );
};

export default EditProfilePage;
