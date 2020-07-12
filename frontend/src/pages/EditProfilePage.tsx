

import * as React from 'react';
import {FC} from "react";
import Page from "@/templates/page";
import Input from "@/atoms/input";
import {Subtitle, Subtitle2} from "@/atoms/typography";
import HorizontalRule from "@/atoms/horizontalRule";
import {Row} from "@/atoms/grid";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Alert from "@/molecules/alert";


const EditProfilePage: FC = () => (
  <Page>
    <Alert title="Email verification" subtitle="Email isn't verified" variant="warning" />
    <Alert title="Registration completion" subtitle="Fill out the fields below and click 'Save' to complete the registration" variant="info" />

    <Spacer top={Padding.Medium} />

    <Subtitle2>General info</Subtitle2>

    <Spacer top={Padding.Normal} />

    <HorizontalRule />

    <Spacer top={Padding.Normal} />

    <Row>
      <Input label="Username" />

      <Spacer left={Padding.Normal} />

      <Input label="Fullname" />
    </Row>
  </Page>
);

export default EditProfilePage;
