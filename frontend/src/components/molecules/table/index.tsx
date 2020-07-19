import styled from 'styled-components';
import {
  background,
  foreground,
} from '~/mixins/color';
import {normalShadow} from "~/mixins/shadow";

const Table = styled.table<{ variant?: string, shrink?: boolean }>`
  ${normalShadow};

  width: 100%;

  border-collapse: collapse;

  background: ${background};
  color: ${foreground};
  
  th {
    font-weight: bolder;
    padding: ${props => props.shrink ? '10px 15px' : '18px 15px'};
    
    background: rgba(0, 0, 0, 0.05);
  }

  td,
  th {
    text-align: left;
  }
  
  td {
    background: rgba(255, 255, 255, 0.1);
    padding: ${props => props.shrink ? '10px 15px' : '15px'};
    border-top: 1px solid #ddd;
  }
`;

export default Table;
