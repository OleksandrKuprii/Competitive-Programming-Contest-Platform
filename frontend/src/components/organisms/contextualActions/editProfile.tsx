import * as React from 'react';
import {FC} from "react";
import Button from '@/toucanui/atoms/button';
import ButtonGroup from "@/molecules/buttonGroup";
import {useStoreActions} from "~/hooks/store";

const EditProfileActions: FC = () => {
  const onSave = useStoreActions(actions => actions.myProfileEdit.onSave);

  return (
    <ButtonGroup>
      <Button onClick={() => onSave()}>
        Save
      </Button>
      <Button>
        Discard
      </Button>
    </ButtonGroup>
  );
};

export default EditProfileActions;
