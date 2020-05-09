import styled from 'styled-components';
import { color } from '../../../theme';

const Table = styled.table<{ variant?: string }>`
  width: 100%;

  box-shadow: 2px 2px 2px 2px #000;

  border-collapse: collapse;

  thead {
    background: ${color};
  }

  th {
    text-align: left;
  }

  td,
  th {
    padding: 10px;
  }
`;

Table.defaultProps = {
  variant: 'dark',
};

export default Table;
