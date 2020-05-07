import * as React from 'react';
import { FC, ReactNode } from 'react';
import { Table } from 'react-bootstrap';

interface StyledTableProps {
  children: ReactNode;
}

const StyledTable: FC<StyledTableProps> = ({ children }) => (
  <Table variant="dark" hover striped size="sm" borderless>
    {children}
  </Table>
);

export default StyledTable;
