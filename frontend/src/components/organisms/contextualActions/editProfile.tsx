import * as React from 'react';
import {FC} from "react";
import Button from '@/toucanui/atoms/button';
import ButtonGroup from "@/molecules/buttonGroup";
import {useStoreActions, useStoreState} from "~/hooks/store";

const EditProfileActions: FC = () => {
  const onSave = useStoreActions(actions => actions.myProfileEdit.onSave);

  const saving = useStoreState(state => state.myProfileEdit.loadingStatus);
  const edited = useStoreState(state => state.myProfileEdit.edited);

  return (
    <ButtonGroup>
      <Button onClick={() => onSave()} loading={saving} disabled={!edited || saving}>
        Save
      </Button>
      <Button disabled={!edited || saving}>
        Discard
      </Button>
    </ButtonGroup>
  );
};

export default EditProfileActions;
