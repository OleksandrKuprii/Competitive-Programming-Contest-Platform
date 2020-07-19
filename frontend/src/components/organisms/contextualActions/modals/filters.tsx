import * as React from 'react';
import {FC} from 'react';
import Select from "@/molecules/select";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import {Subtitle2} from "@/toucanui/atoms/typography";
import {MaterialSlider} from "react-multi-thumb-slider";
import {allColors} from "~/mixins/color";
import Checkbox from "@/toucanui/atoms/checkbox";
import {Result} from "~/typings/models";
import Modal from "@/molecules/modal";
import {useStoreActions, useStoreState} from "~/hooks/store";


interface FiltersModalProps {
  onClose: () => any;
  show: boolean;
}


const FiltersModal: FC<FiltersModalProps> = ({onClose, show}) => {
  const filtersApplied = useStoreState(state => state.filterAndSort.filtersApplied);
  const categories = useStoreState(state => state.task.categories)
  const selectedCategories = useStoreState(state => state.filterAndSort.categories)
  const difficultyRange = useStoreState(state => state.filterAndSort.difficultyRange)
  const results = useStoreState(state => state.filterAndSort.results);

  const onClearAll = useStoreActions(actions => actions.filterAndSort.clearedFilters);
  const selectCategories = useStoreActions(actions => actions.filterAndSort.selectedCategories);
  const selectDifficultyRange = useStoreActions(actions => actions.filterAndSort.selectedDifficultyRange);
  const toggleResult = useStoreActions(actions => actions.filterAndSort.toggledResult);

  return (
    <Modal show={show} title="Filters" onClose={onClose} additionalActions={[{
      label: 'Clear all',
      onClick: () => onClearAll(),
      variant: 'light',
      disabled: !filtersApplied
    }]}>
      <Select
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
            selectCategories([]);
            return;
          }

          const ids = selected.map((s: any) => s.value);

          selectCategories(ids);
        }}
      />

      <Spacer top={Padding.Medium}/>

      <Subtitle2>Difficulty</Subtitle2>

      <Spacer top={Padding.Normal}/>

      <MaterialSlider min={1} max={10} values={difficultyRange} onChange={selectDifficultyRange}
                      accentColor={allColors.primary}/>

      <Spacer top={Padding.Medium}/>

      <Checkbox label="Correct" value={results.includes(Result.Correct)}
                onClick={() => toggleResult(Result.Correct)}/>
      <Checkbox label="Partial" value={results.includes(Result.Partial)}
                onClick={() => toggleResult(Result.Partial)}/>
      <Checkbox label="Zero" value={results.includes(Result.Zero)} onClick={() => toggleResult(Result.Zero)}/>
      <Checkbox label="Not started" value={results.includes(Result.NotStarted)}
                onClick={() => toggleResult(Result.NotStarted)}/>
    </Modal>
  );
};

export default FiltersModal;
