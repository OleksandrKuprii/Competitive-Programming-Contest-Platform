// Contextual actions for task page

import * as React from 'react';
import {useCallback, useState} from 'react';
import StyledSelect from "@/atoms/styledSelect";
import {useTranslation} from "react-i18next";
import {useStoreActions, useStoreState} from "~/hooks/store";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Modal from "@/molecules/modal";
import {Subtitle2} from "@/atoms/typography";
import Button from "@/atoms/button";
import Checkbox from "@/atoms/checkbox";
import {Result} from "~/typings/models";

const TasksActions = () => {
  const {t} = useTranslation();

  const {
    selectedCategories: selectedCategoriesAction,
    toggledResult,
    selectedDifficultyRange,
    clearedFilters
  } = useStoreActions((actions) => ({
    ...actions.filterAndSort,
  }));

  const difficultyRange = useStoreState(
    (state) => state.filterAndSort.difficultyRange,
  );
  const selectedCategories = useStoreState(
    (state) => state.filterAndSort.categories,
  );
  const results = useStoreState((state) => state.filterAndSort.results);
  const categories = useStoreState((state) => state.task.categories);

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

      {showModal && <Modal title="Filters" onClose={closeModal} additionalActions={[{
        label: 'Clear all',
        onClick: () => clearedFilters(),
        variant: 'light',
      }]}>
        <StyledSelect
          isMulti
          closeMenuOnSelect={false}
          placeholder="Category..."
          value={categories
            .filter((c) => selectedCategories.includes(c.id))
            .map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          onChange={(selected: any) => {
            if (selected === null) {
              selectedCategoriesAction([]);
              return;
            }

            const ids = selected.map((s: any) => s.value);

            selectedCategoriesAction(ids);
          }}
        />

        <Spacer top={Padding.Medium}/>

        <Subtitle2>Difficulty</Subtitle2>

        <Spacer top={Padding.Normal}/>

        <Spacer top={Padding.Medium}/>

        <Checkbox label="Correct" value={results.includes(Result.Correct)}
                  onClick={() => toggledResult(Result.Correct)}/>
        <Checkbox label="Partial" value={results.includes(Result.Partial)}
                  onClick={() => toggledResult(Result.Partial)}/>
        <Checkbox label="Zero" value={results.includes(Result.Zero)} onClick={() => toggledResult(Result.Zero)}/>
        <Checkbox label="Not started" value={results.includes(Result.NotStarted)}
                  onClick={() => toggledResult(Result.NotStarted)}/>
      </Modal>}
    </>
  );
};

export default TasksActions;
