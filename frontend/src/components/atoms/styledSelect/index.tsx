import * as React from 'react';
import { FC } from 'react';
import Select, { Props } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const StyledSelect: FC<Props> = (props) => (
  <Select
    components={animatedComponents as any}
    theme={(theme) => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        neutral0: '#121212',
        neutral5: '#222',
        neutral10: '#333',
        neutral20: '#444',
        neutral30: '#555',
        neutral40: '#666',
        neutral50: '#777',
        neutral60: '#888',
        neutral70: '#999',
        neutral80: '#aaa',
        neutral90: '#bbb',
        primary25: '#222',
        primary50: '#222',
        primary75: '#222',
        primary: '#aaa',
      },
    })}
    {...props}
  />
);

export default StyledSelect;
