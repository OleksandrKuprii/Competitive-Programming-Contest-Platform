import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import GeneralFilter from './GeneralFilter';

interface SelectableFilterArgs {
  header: string;
  children: React.ReactNode;
}

const SelectableFilter = ({ header, children }: SelectableFilterArgs) => (
  <GeneralFilter header={header}>
    <FormControl as="select">{children}</FormControl>
  </GeneralFilter>
);

export default SelectableFilter;
