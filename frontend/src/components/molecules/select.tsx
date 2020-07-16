import * as React from 'react';
import {FC} from 'react';
import BaseSelect, {Props} from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    zIndex: 999,
  }),
  control: (provided: any) => ({
    ...provided,
    background: 'transparent',
    border: 'none',
    borderWidth: 0,
    borderBottom: '2px #ccc solid',
    borderRadius: 0
  }),
  indicatorSeparator: () => ({
    display: 'none'
  })
}

const Select: FC<Props> = (props) => (
  <BaseSelect
    components={animatedComponents as any}
    styles={customStyles}
    isMulti={false}
    {...props}
  />
);

export default Select;
