import * as React from 'react';
import Button from "@/toucanui/atoms/button";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import ButtonGroup from "@/molecules/buttonGroup";
import useHasUserPermissions from "~/hooks/useHasUserPermissions";
import {useStoreActions} from "~/hooks/store";
import SubmitModal from "@/organisms/contextualActions/modals/submitModal";
import {useCallback, useState} from "react";
import { useParams } from 'react-router-dom';

const TaskActions = () => {
  const { id } = useParams();

  const hasUserPermissions = useHasUserPermissions();

  const onFontDeltaDown = useStoreActions(actions => actions.customFont.onFontDeltaDown);
  const onFontDeltaUp = useStoreActions(actions => actions.customFont.onFontDeltaUp);

  const [showModal, setShowModal] = useState(false);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <Button disabled={!hasUserPermissions} onClick={openModal}>Submit</Button>

      <Spacer right={Padding.Normal}/>

      <ButtonGroup>
        <Button onClick={onFontDeltaUp as any}>A+</Button>
        <Button onClick={onFontDeltaDown as any}>A-</Button>
      </ButtonGroup>

      {showModal && <SubmitModal onClose={closeModal} taskId={id} />}
    </>
  );
};

export default TaskActions;
