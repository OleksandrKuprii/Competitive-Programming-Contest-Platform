import * as React from 'react';
import {FC, useCallback} from "react";
import {AlignItems, JustifyContent, Row} from "@/toucanui/atoms/grid";
import {Link, useHistory} from 'react-router-dom';
import {Title} from "@/toucanui/atoms/typography";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import brandIcon from '~/assets/brandIcon.png';
import {FiSend, MdList, MdSend} from "react-icons/all";
import styled from "styled-components";

const SidebarLinks = styled.div`
  display: flex;
  align-items: center;
  font-size: 30px;
  color: #ccc;
  
  a {
    transform: translateY(6%);
    transition: 0.3s all ease-in-out;
    
    &:hover {
      color: #fff;
      transform: translateY(5%) scale(1.1);
    }
  }
`;

const SidebarNavigation: FC = () =>
  (
    <Row justifyContent={JustifyContent.FlexEnd} style={{height: '100%', overflow: 'hidden'}}
         alignItems={AlignItems.Center}>
      <Spacer left={Padding.Normal}/>
      <img src={brandIcon} height="80%"/>

      <Spacer left={Padding.Normal}/>
      <Title>Toucan</Title>

      <div style={{marginLeft: 'auto'}}/>

      <SidebarLinks>
        <Link to="/submissions">
          <MdSend/>
        </Link>

        <Spacer left={Padding.Medium}/>

        <Link to="/tasks">
          <MdList/>
        </Link>

        <Spacer left={Padding.Medium}/>
      </SidebarLinks>
    </Row>
  );

export default SidebarNavigation;
