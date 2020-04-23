import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { FormEvent } from 'react';
import GeneralFilter from './GeneralFilter';

interface SelectableFilterArgs {
  header: string;
  value: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

const SelectableFilter = ({
  header,
  children,
  value,
  onChange,
}: SelectableFilterArgs) => (
  <GeneralFilter header={header}>
    <FormControl as="select" value={value} onChange={onChange}>
      {children}
    </FormControl>
  </GeneralFilter>
);

export default SelectableFilter;
