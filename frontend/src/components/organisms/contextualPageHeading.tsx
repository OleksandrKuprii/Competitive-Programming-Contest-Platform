import * as React from 'react';
import WideBox from "@/atoms/wideBox";
import TasksHeading from "@/organisms/contextualHeadings/tasks";
import TaskHeading from "@/organisms/contextualHeadings/task";
import {AlignItems, JustifyContent, Row} from "@/atoms/grid";
import { Switch, Route } from 'react-router-dom';
import EditProfileHeading from "@/organisms/contextualHeadings/editProfile";


const ContextualPageHeading = () =>
  (
    <Switch>
      <Route path="/tasks" exact>
        <TasksHeading/>
      </Route>
      <Route path="/task/view/:id">
        <TaskHeading/>
      </Route>
      <Route path="/edit/profile">
        <EditProfileHeading />
      </Route>
    </Switch>
  );

const ContextualPageHeadingWrapper = () => (
  <WideBox variant="dark">
    <Row justifyContent={JustifyContent.Center} alignItems={AlignItems.Center}  height="53px">
      <ContextualPageHeading/>
    </Row>
  </WideBox>
);

export default ContextualPageHeadingWrapper;
