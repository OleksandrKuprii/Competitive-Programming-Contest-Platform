import styled from 'styled-components';
import { background, foreground } from '~/mixins/color';
import { normalShadow } from '~/mixins/shadow';

const Table = styled.table<{ variant?: string }>`
  ${normalShadow};

  width: 100%;

  border-collapse: collapse;

  background: ${background};
  color: ${foreground};

  th {
    text-align: left;
  }

  td,
  th {
    padding: 10px;
  }
`;

export default Table;
