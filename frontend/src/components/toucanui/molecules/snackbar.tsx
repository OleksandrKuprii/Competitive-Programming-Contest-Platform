import * as React from 'react';
import {FC} from "react";
import styled from "styled-components";
import Box from "@/toucanui/atoms/box";
import {Padding} from "~/mixins/padding";
import LinkButton from "@/toucanui/atoms/linkButton";
import {majorFocusShadow, normalShadow} from "~/mixins/shadow";
import {allColors} from "~/mixins/color";

const SnackbarContainer = styled(Box)`
  ${majorFocusShadow};

  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 15px 20px;
  
  margin-top: 40px;
  
  border-radius: 7px;
  
  > button {
    font-size: 1.05em;
    font-weight: bold;
  }
`;

interface Action {
  handler: (() => any) | string;
  text: string;
}

interface SnackbarProps {
  message: string;
  action?: Action;
}

const Snackbar: FC<SnackbarProps> = ({ message, action }) => (
  <SnackbarContainer>
    {message}

    {action &&
      <>
        <LinkButton variant="primary">{action.text}</LinkButton>
      </>}
  </SnackbarContainer>
);

export default Snackbar;
