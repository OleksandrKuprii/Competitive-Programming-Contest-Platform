// contextualPageActions.tsx - guess what is does

import * as React from 'react';
import WideBox from '@/atoms/wideBox';
import TasksActions from "@/organisms/contextualActions/tasks";

import {AlignItems, JustifyContent, Row} from "@/atoms/grid";
import TaskActions from "@/organisms/contextualActions/task";
import { Switch, Route } from 'react-router-dom';
import EditProfileActions from "@/organisms/contextualActions/editProfile";


const ContextualPageActions = () => (
  <Switch>
    <Route path="/tasks" exact>
      <TasksActions/>
    </Route>
    <Route path="/task/view/:id">
      <TaskActions/>
    </Route>
    <Route path="/edit/profile">
      <EditProfileActions />
    </Route>
  </Switch>
)

const ContextualPageActionsWrapper = () => {
  return (
    <WideBox variant="grey">
      <Row justifyContent={JustifyContent.Center} alignItems={AlignItems.Center} height="59px">
        <ContextualPageActions/>
      </Row>
    </WideBox>
  )
};

export default ContextualPageActionsWrapper;
