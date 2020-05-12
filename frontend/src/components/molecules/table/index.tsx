import styled from 'styled-components';
import { color } from '~/theme';
import shadow from '~/mixins/shadow';

const Table = styled.table<{ variant?: string }>`
  ${shadow};

  width: 100%;

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
