// contextualPageActions.tsx - guess what is does

import * as React from 'react';
import {useHistory} from 'react-router-dom';
import WideBox from '@/atoms/wideBox';
import {Padding} from "~/mixins/padding";
import TasksPageContextualActions from "@/organisms/contextualActions/tasks";
import Button from "@/atoms/button";
import {AlignItems, JustifyContent, Row} from "@/atoms/grid";
import Spacer from "@/atoms/spacer";
import ButtonGroup from "@/molecules/buttonGroup";
import {isTask, isTasks} from "@/organisms/pathnameTesters";


const ContextualPageActions = () => {
  const history = useHistory();

  const { pathname } = history.location;

  if (isTasks(pathname)) {
    return <TasksPageContextualActions />;
  }

  if (isTask(pathname)) {
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
    <WideBox variant="primary">
      <Row justifyContent={JustifyContent.Center} alignItems={AlignItems.Center} height="59px">
        <ContextualPageActions />
      </Row>
    </WideBox>
  )
};

export default ContextualPageActionsWrapper;
