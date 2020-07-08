import * as React from 'react';
import {Text, Title} from "@/atoms/typography";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Difficulty from "@/atoms/difficulty";
import { useParams } from 'react-router-dom';
import {useStoreState} from "~/hooks/store";
import {FC} from "react";

const TaskHeading: FC = () => {
  const { id } = useParams();

  const tasks = useStoreState((state) => state.task.tasks);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return <></>;
  }

  return (
    <>
      <Title>{task.name} </Title>

      <Spacer left={Padding.Normal}/>

      <Text> [{task.categoryName}] </Text>

      <Spacer left={Padding.Normal}/>

      <Title>{task.difficulty && <Difficulty difficulty={task.difficulty}/>}</Title>
    </>
  );
};

export default TaskHeading;
