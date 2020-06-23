import * as React from 'react';
import { FC } from 'react';
import styled, { css } from 'styled-components';
import Box from '@/atoms/box';
import Button from "@/atoms/button";

interface PillSelectProps {
  options: { id: string; name: string }[];
  active: string[];
  onChange: (newState: string[]) => any;
}

const Pill = styled(Button)<{ variant: string; active: boolean }>`
  padding: 10px;
  margin: 0 2px;
  transition: all 0.2s ease-in-out;
`;

const PillSelect: FC<PillSelectProps> = ({ options, active, onChange }) => (
  <>
    {options.map(({ name, id }) => (
      <Pill
        variant={active.includes(id) ? 'primaryComplement' : ''}
        active={active.includes(id)}
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
