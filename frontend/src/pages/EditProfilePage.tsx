import * as React from 'react';
import {FC, useCallback} from "react";
import Page from "@/templates/page";
import Input from "@/atoms/input";
import {Subtitle, Subtitle2} from "@/atoms/typography";
import HorizontalRule from "@/atoms/horizontalRule";
import {Col, Row} from "@/atoms/grid";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Alert from "@/molecules/alert";
import {useStoreState, useStoreActions} from "~/hooks/store";
import Select from "@/molecules/select";


const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

const selectOptions = months.map(month => ({
  label: month[0].toUpperCase() + month.substr(1),
  value: month,
}));


const EditProfilePage: FC = () => {
  const username = useStoreState(state => state.myProfileEdit.username);
  const fullname = useStoreState(state => state.myProfileEdit.fullname);

  const birthDay = useStoreState(state => state.myProfileEdit.birthDay);
  const birthMonth = useStoreState(state => state.myProfileEdit.birthMonth);
  const birthYear = useStoreState(state => state.myProfileEdit.birthYear);

  const onUsernameChange = useStoreActions(actions => actions.myProfileEdit.onUsernameChange);
  const onFullnameChange = useStoreActions(actions => actions.myProfileEdit.onFullnameChange);

  const onBirthDayChange = useStoreActions(actions => actions.myProfileEdit.onBirthDayChange);
  const onBirthMonthChange = useStoreActions(actions => actions.myProfileEdit.onBirthMonthChange);
  const onBirthYearChange = useStoreActions(actions => actions.myProfileEdit.onBirthYearChange);

  return (
    <Page>
      <Alert title="Email verification" subtitle="Email isn't verified" variant="warning"/>
      <Alert title="Registration completion"
             subtitle="Fill out the fields below and click 'Save' to complete the registration" variant="info"/>

      <Spacer top={Padding.Medium}/>

      <Subtitle2>General info</Subtitle2>

      <Spacer top={Padding.Normal}/>

      <Row>
        <Input label="Username" value={username} onChange={onUsernameChange as any}/>

        <Spacer left={Padding.Normal}/>

        <Input label="Fullname" value={fullname} onChange={onFullnameChange as any}/>
      </Row>

      <Spacer top={Padding.Normal}/>

      <Subtitle2>Birthdate</Subtitle2>

      <Spacer top={Padding.Normal}/>

      <Row>
        <Input label="Day" value={birthDay} onChange={onBirthDayChange as any} type="number" wide={false} />

        <Spacer left={Padding.Normal}/>

        <Input label="Month" value={birthMonth} onChange={onBirthMonthChange as any} type="number" wide={false} />

        <Spacer left={Padding.Normal}/>

        <Input label="Year" value={birthYear} onChange={onBirthYearChange as any} type="number" wide={false} />
      </Row>
    </Page>
  );
};

export default EditProfilePage;
