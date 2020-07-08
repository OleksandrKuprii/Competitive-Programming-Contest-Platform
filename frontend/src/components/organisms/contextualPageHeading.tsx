import * as React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import WideBox from "@/atoms/wideBox";
import {Padding} from "~/mixins/padding";
import TasksHeading from "@/organisms/contextualHeadings/tasks";
import TaskHeading from "@/organisms/contextualHeadings/task";
import {FC} from "react";
import {isTask, isTasks} from "@/organisms/pathnameTesters";
import {AlignItems, JustifyContent, Row} from "@/atoms/grid";


const ContextualPageHeading = () => {
  const history = useHistory();

  const {pathname} = history.location;

  if (isTasks(pathname)) {
    return <TasksHeading/>
  }

  if (isTask(pathname)) {
    return <TaskHeading/>
  }

  return <></>;
};

const ContextualPageHeadingWrapper = () => (
  <WideBox variant="dark">
    <Row justifyContent={JustifyContent.Center} alignItems={AlignItems.Center}  height="53px">
      <ContextualPageHeading/>
    </Row>
  </WideBox>
);

export default ContextualPageHeadingWrapper;
