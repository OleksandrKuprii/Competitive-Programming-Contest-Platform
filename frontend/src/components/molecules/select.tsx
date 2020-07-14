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
