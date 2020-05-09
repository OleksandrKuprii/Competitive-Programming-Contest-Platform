import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { color, hoverColor } from '../../../theme';

interface PillSelectProps {
  options: { id: string; name: string }[];
  active: string[];
  onChange: (newState: string[]) => any;
}

const Pill = styled.div<{ variant: string }>`
  border-radius: 10px;
  padding: 10px;
  margin: 0 2px;
  transition: all 0.2s ease-in-out;

  background: ${color};

  &:hover {
    background: ${hoverColor};
  }
`;

const PillSelect: FC<PillSelectProps> = ({ options, active, onChange }) => (
  <>
    {options.map(({ name, id }) => (
      <Pill
        variant={active.includes(id) ? 'primary' : 'dark'}
        key={id}
        onClick={() => {
          const newState = [...active];

          if (newState.includes(id)) {
            onChange(newState.filter((i) => i !== id));
            return;
          }

          newState.push(id);
          onChange(newState);
        }}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {name}
      </Pill>
    ))}
  </>
);

export default PillSelect;
