import * as React from 'react';
import { FC } from 'react';
import { Badge } from 'react-bootstrap';

interface PillSelectProps {
  options: { id: string; name: string }[];
  active: Set<string>;
  onToggle: (id: string) => any;
}

const PillSelect: FC<PillSelectProps> = ({ options, active, onToggle }) => (
  <>
    {options
      .sort((a, b) => {
        const hasA = active.has(a.id);
        const hasB = active.has(b.id);

        if (hasA && !hasB) {
          return -1;
        }

        if (hasB && !hasA) {
          return 1;
        }

        return 0;
      })
      .map(({ name, id }) => (
        <Badge
          pill
          key={id}
          variant={active.has(id) ? 'light' : 'dark'}
          onClick={() => onToggle(id)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {name}
        </Badge>
      ))}
  </>
);

export default PillSelect;
