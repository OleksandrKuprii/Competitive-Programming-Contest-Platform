import * as React from 'react';
import {FC, useCallback} from "react";
import {AlignItems, JustifyContent, Row} from "@/atoms/grid";
import NavButton from "@/atoms/navButton";
import {FiList, FiSend} from "react-icons/all";
import { useHistory } from 'react-router-dom';
import {Title} from "@/atoms/typography";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";
import brandIcon from '~/assets/brandIcon.png';

const SidebarNavigation: FC = () => {
  const history = useHistory();

  const { pathname } = history.location;

  const goTasks = useCallback(() => {
    history.push('/tasks');
  }, []);

  const goSubmissions = useCallback(() => {
    history.push('/submissions');
  }, []);

  return (
    <Row justifyContent={JustifyContent.FlexEnd} style={{ height: '100%', overflow: 'hidden' }} alignItems={AlignItems.Center}>
      <Spacer left={Padding.Normal} />
      <img src={brandIcon} height="80%" />

      <Spacer left={Padding.Normal} />
      <Title>Toucan</Title>

      <div style={{marginLeft: 'auto'}} />

      <NavButton variant="darkDarken" onClick={goSubmissions}>
        <FiSend/>
      </NavButton>

      <NavButton variant="darkDarken" onClick={goTasks}>
        <FiList />
      </NavButton>
    </Row>
  )
};

export default SidebarNavigation;
