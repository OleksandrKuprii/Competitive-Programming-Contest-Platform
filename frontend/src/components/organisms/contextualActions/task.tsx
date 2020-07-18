import * as React from 'react';
import Button from "@/toucanui/atoms/button";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import ButtonGroup from "@/molecules/buttonGroup";
import useHasUserPermissions from "~/hooks/useHasUserPermissions";
import {useStoreActions} from "~/hooks/store";

const TaskActions = () => {
  const hasUserPermissions = useHasUserPermissions();

  const onFontDeltaDown = useStoreActions(actions => actions.customFont.onFontDeltaDown);
  const onFontDeltaUp = useStoreActions(actions => actions.customFont.onFontDeltaUp);

  return (
    <>
      <Button variant="primaryComplement" disabled={!hasUserPermissions}>Submit</Button>

      <Spacer right={Padding.Normal}/>

      <ButtonGroup>
        <Button onClick={onFontDeltaUp as any}>A+</Button>
        <Button onClick={onFontDeltaDown as any}>A-</Button>
      </ButtonGroup>
    </>
  );
};

export default TaskActions;
