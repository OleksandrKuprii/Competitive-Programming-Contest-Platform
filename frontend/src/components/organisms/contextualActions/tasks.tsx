// Contextual actions for task page

import * as React from 'react';
import {Col, Grid, JustifyContent, Row} from "@/atoms/grid";
import StyledSelect from "@/atoms/styledSelect";
import {getTrackBackground, Range} from "react-range";
import PillSelect from "@/molecules/pillSelect";
import WideBox from "@/atoms/wideBox";
import {useTranslation} from "react-i18next";
import {useStoreActions, useStoreState} from "~/hooks/store";
import {useState} from "react";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";

const TasksActions = () => {
  const {t} = useTranslation();

  const {
    selectedCategories: selectedCategoriesAction,
    selectedResults,
    selectedDifficultyRange,
  } = useStoreActions((actions) => ({
    ...actions.filterAndSort,
  }));

  const tasksLoading = useStoreState((state) => state.task.loadingStatus);
  const difficultyRange = useStoreState(
    (state) => state.filterAndSort.difficultyRange,
  );
  const selectedCategories = useStoreState(
    (state) => state.filterAndSort.categories,
  );
  const results = useStoreState((state) => state.filterAndSort.results);
  const categories = useStoreState((state) => state.task.categories);

  const [difficultyValues, setDifficultyValues] = useState(difficultyRange);

  return (
    <>
      <div style={{ width: '15vw' }}>
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
      </div>

      <Spacer left={Padding.Large} />

      <div style={{ width: '15vw' }}>
        <Range
          onChange={(v) => {
            setDifficultyValues(v);
          }}
          onFinalChange={selectedDifficultyRange}
          min={1}
          max={10}
          values={difficultyValues}
          renderThumb={({props, index}) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '20px',
                width: '20px',
                backgroundColor: '#333',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 1px 3px #000',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-28px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily:
                    'Arial,Helvetica Neue,Helvetica,sans-serif',
                  padding: '4px',
                  backgroundColor: '#212121',
                }}
              >
                {
                  [
                    'newbie',
                    'novice',
                    'rookie',
                    'beginner',
                    'intermediate',
                    'skillful',
                    'seasoned',
                    'advanced',
                    'senior',
                    'expert',
                  ][difficultyValues[index] - 1]
                }
              </div>
              <div
                style={{
                  height: '8px',
                  width: '4px',
                  backgroundColor: '#CCC',
                }}
              />
            </div>
          )}
          renderTrack={({props, children}) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '24px',
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '20px',
                  width: '100%',
                  background: getTrackBackground({
                    values: difficultyValues,
                    colors: ['transparent', '#212121', 'transparent'],
                    min: 1,
                    max: 10,
                  }),
                  alignSelf: 'center',
                  boxShadow: '2px 2px 2px 2px #000',
                }}
              >
                {children}
              </div>
            </div>
          )}
        />
      </div>

      <Spacer left={Padding.Large} />

      <div >
        <PillSelect
          options={[
            {id: 'correct', name: 'Correct'},
            {id: 'partial', name: 'Partial'},
            {id: 'zero', name: 'Zero'},
            {id: 'notStarted', name: 'Not Started'},
          ]}
          active={results}
          onChange={selectedResults}
        />
      </div>
    </>
  );
};

export default TasksActions;
