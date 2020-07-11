import * as React from 'react';
import { FC } from 'react';
import Select, { Props } from 'react-select';
import makeAnimated from 'react-select/animated';
import Box from '@/atoms/box';
import '@/atoms/styledSelect/style.scss';

const animatedComponents = makeAnimated();

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    zIndex: 2,
  }),
}

const StyledSelect: FC<Props> = (props) => (
  <Select
    components={animatedComponents as any}
    styles={customStyles}
    {...props}
  />
);

export default StyledSelect;
