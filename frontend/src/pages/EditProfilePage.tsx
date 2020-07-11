

import * as React from 'react';
import {FC} from "react";
import Page from "@/templates/page";
import Input from "@/atoms/input";
import {Subtitle, Subtitle2} from "@/atoms/typography";
import HorizontalRule from "@/atoms/horizontalRule";
import {Row} from "@/atoms/grid";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";


const EditProfilePage: FC = () => (
  <Page>
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
