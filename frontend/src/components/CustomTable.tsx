import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'react-bootstrap/Table';
import { ReactNode } from 'react';
import SortControl from './SortControl';

export type CustomTableRowIdentifier = number | string;
export type CustomTableRow = {
  id: CustomTableRowIdentifier;
  row: ReactNode;
};

export interface CustomTableArgs {
  headers: string[];
  rows: CustomTableRow[];
  padding?: number;
  tableName: string;
  enableSortOptionIn?: string[];
}

const CustomTable = ({
  headers,
  rows,
  padding,
  tableName,
  enableSortOptionIn,
}: CustomTableArgs) => {
  const { t } = useTranslation();

  return (
    <Table hover variant="dark" borderless size="sm" striped>
      <thead className="thead-dark">
        <tr>
          {headers.map((header) => (
            <th key={`table-${tableName}-header-${header}`} style={{ paddingLeft: padding }}>
              <div className="d-flex justify-content-start">
                {t(`headers.${header}`)}
                {enableSortOptionIn && enableSortOptionIn.includes(header) ? (
                  <SortControl />
                ) : undefined}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map(({ row, id }) => (
          <tr key={`table-${tableName}-row-${id}`}>{row}</tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CustomTable;
