import * as React from 'react';
import Button from "@/atoms/button";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";
import ButtonGroup from "@/molecules/buttonGroup";
import useHasUserPermissions from "~/hooks/useHasUserPermissions";

const TaskActions = () => {
  const hasUserPermissions = useHasUserPermissions();

  return (
    <>
      <Button variant="primaryComplement" disabled={!hasUserPermissions}>Submit</Button>

      <Spacer right={Padding.Normal}/>

      <ButtonGroup>
        <Button>A+</Button>
        <Button>A-</Button>
      </ButtonGroup>
    </>
  );
};

export default TaskActions;
