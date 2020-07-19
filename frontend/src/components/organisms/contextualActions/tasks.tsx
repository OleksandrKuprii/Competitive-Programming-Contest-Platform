// Contextual actions for task page

import * as React from 'react';
import {useCallback, useState} from 'react';
import Button from "@/toucanui/atoms/button";
import FiltersModal from "@/organisms/contextualActions/modals/filters";

const TasksActions = () => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <Button onClick={openModal}>
        Filters
      </Button>

      {showModal && <FiltersModal onClose={closeModal} />}
    </>
  );
};

export default TasksActions;
