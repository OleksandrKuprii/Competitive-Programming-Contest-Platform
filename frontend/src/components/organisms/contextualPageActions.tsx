// contextualPageActions.tsx - guess what is does

import * as React from 'react';
import {useHistory} from 'react-router-dom';
import WideBox from '@/atoms/wideBox';
import {Padding} from "~/mixins/padding";
import TasksPageContextualActions from "@/organisms/contextualActions/tasksPage";
import Button from "@/atoms/button";
import {Row} from "@/atoms/grid";
import Spacer from "@/atoms/spacer";
import Box from "@/atoms/box";
import ButtonGroup from "@/molecules/buttonGroup";


const ContextualPageActions = () => {
  const history = useHistory();

  if (history.location.pathname === '/tasks') {
    return <TasksPageContextualActions />;
  }

  if (history.location.pathname.match(/\/task\/view/)) {
    return <Row>
      <Button variant="primaryComplement">Submit</Button>

      <Spacer right={Padding.Normal} />


      <ButtonGroup>

      <Button>A+</Button>
      <Button>A-</Button>
        </ButtonGroup>
    </Row>
  }

  return <></>;
};

const ContextualPageActionsWrapper = () => {
  return (
    <WideBox variant="primary" padding={Padding.Normal} height="59px">
      <ContextualPageActions />
    </WideBox>
  )
};

export default ContextualPageActionsWrapper;
