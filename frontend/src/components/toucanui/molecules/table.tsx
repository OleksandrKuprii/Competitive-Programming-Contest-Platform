import * as React from 'react';
import styled, {css} from "styled-components";
import {FC, ReactNode, useContext} from "react";
import {normalShadow} from "~/mixins/shadow";

const TableContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  
  ${normalShadow};
`;

const ColsContext = React.createContext(12);

interface TableProps {
  cols: number;
  children: ReactNode;
}

export const Table: FC<TableProps> = ({cols, children}) => (
  <ColsContext.Provider value={cols}>
    <TableContainer>
      {children}
    </TableContainer>
  </ColsContext.Provider>
);

const TableColContainer = styled.div<{ size?: number, cols: number, header?: boolean }>`
  width: ${props => (props.size || 1) / props.cols * 100}%;
  
  display: flex;
  vertical-align: center;
  
  ${props => props.header
  ? (css`
      padding: 15px 10px;
      background-color: rgba(0, 0, 0, 0.05);
      font-weight: bold;
    `)
  : (css`
      padding: 12px 10px;
      background-color: rgba(255, 255, 255, 0.1);
      
      border-top: 1px solid #ddd;
    `)};
  
  > a, > button {
    display: block;
    width: 100%;
  }
`;

interface TableColProps {
  size?: number;
  children: ReactNode;
  header?: boolean;
}

export const TableCol: FC<TableColProps> = ({size, children, header}) => {
  const cols = useContext(ColsContext);

  return (
    <TableColContainer cols={cols} size={size} header={header}>
      {children}
    </TableColContainer>
  )
};
