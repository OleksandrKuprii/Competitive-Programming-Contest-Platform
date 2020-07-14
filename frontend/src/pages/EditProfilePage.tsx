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


const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october, november, december'];

const selectOptions = months.map(month => ({
  label: month[0].toUpperCase() + month.substr(1),
  value: month,
}));


const EditProfilePage: FC = () => {
  const username = useStoreState(state => state.myProfileEdit.username);
  const fullname = useStoreState(state => state.myProfileEdit.fullname);

  const onUsernameChange = useStoreActions(actions => actions.myProfileEdit.onUsernameChange);
  const onFullnameChange = useStoreActions(actions => actions.myProfileEdit.onFullnameChange);

  return (
    <Page>
      <Alert title="Email verification" subtitle="Email isn't verified" variant="warning"/>
      <Alert title="Registration completion"
             subtitle="Fill out the fields below and click 'Save' to complete the registration" variant="info"/>

      <Spacer top={Padding.Medium}/>

      <Subtitle2>General info</Subtitle2>

      <Spacer top={Padding.Normal}/>

      <HorizontalRule/>

      <Spacer top={Padding.Normal}/>

      <Row>
        <Input label="Username" value={username} onChange={onUsernameChange}/>

        <Spacer left={Padding.Normal}/>

        <Input label="Fullname" value={fullname} onChange={onFullnameChange}/>
      </Row>

      <Row>
        <div style={{ width: 300 }}>
        <Select options={selectOptions} />
        </div>

        <Spacer left={Padding.Normal}/>

        <Input label="Day" onChange={alert} />

        <Spacer left={Padding.Normal}/>

        <Input label="Year" onChange={alert} />
      </Row>
    </Page>
  );
};

export default EditProfilePage;
