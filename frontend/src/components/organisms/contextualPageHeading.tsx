import * as React from 'react';
import {useHistory, useParams} from 'react-router-dom';
import WideBox from "@/atoms/wideBox";
import {Title} from "@/atoms/typography";
import {Row} from "@/atoms/grid";
import {useStoreState} from "~/hooks/store";
import Difficulty from "@/atoms/difficulty";
import {Padding} from "~/mixins/padding";

const ContextualPageHeading = () => {
  const tasks = useStoreState((state) => state.task.tasks);

  const {id} = useParams();

  const history = useHistory();

  const {pathname} = history.location;

  if (pathname === '/tasks') {
    return <Title>Tasks</Title>
  }

  if (pathname.match(/\/task\/view/)) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
      return <></>;
    }

    return (
      <Row>
        <Title>{task.name}</Title>
        <Title>{task.difficulty && <Difficulty difficulty={task.difficulty}/>}</Title>
      </Row>
    );
  }

  return <></>;
};

const ContextualPageHeadingWrapper = () => (
  <WideBox variant="dark" height="53px" padding={Padding.Normal}>
    <ContextualPageHeading/>
  </WideBox>
);

export default ContextualPageHeadingWrapper;
