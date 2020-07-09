import * as React from 'react';
import {FC} from "react";
import Button from '~/components/atoms/button';
import ButtonGroup from "@/molecules/buttonGroup";

const EditProfileActions: FC = () => (
  <ButtonGroup>
    <Button>
      Save
    </Button>
    <Button>
      Discard
    </Button>
  </ButtonGroup>
);

export default EditProfileActions;
