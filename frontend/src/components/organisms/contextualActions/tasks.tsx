// Contextual actions for task page

import * as React from 'react';
import {useCallback, useState} from 'react';
import Button from "@/toucanui/atoms/button";
import FiltersModal from "@/organisms/contextualActions/modals/filters";
import {useStoreState} from "~/hooks/store";

const TasksActions = () => {
  const filtersApplied = useStoreState(state => state.filterAndSort.filtersApplied);

  const [showModal, setShowModal] = useState(false);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <Button onClick={openModal} variant={filtersApplied ? 'warning' : 'light'}>
        Filters
        {filtersApplied && ': applied'}
      </Button>

      <FiltersModal show={showModal} onClose={closeModal} />
    </>
  );
};

export default TasksActions;
