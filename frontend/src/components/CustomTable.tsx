import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'react-bootstrap/Table';
import { ReactNode } from 'react';


export type CustomTableRowIdentifier = number | string;
export type CustomTableRow = {
  id: CustomTableRowIdentifier,
  row: ReactNode,
};


export interface CustomTableArgs {
  headers: string[]
  rows: CustomTableRow[]
  padding?: number,
  tableName: string,
}


const CustomTable = ({
  headers, rows, padding, tableName,
}: CustomTableArgs) => {
  const { t } = useTranslation();

  return (
    <Table hover variant="dark" borderless size="sm" striped>
      <thead className="thead-dark">
        <tr>
          {headers.map((header) => (
            <th key={`table-${tableName}-header-${header}`} style={{ paddingLeft: padding }}>
              {t(`headers.${header}`)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map(({ row, id }) => (
          <tr key={`table-${tableName}-row-${id}`}>
            {row}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CustomTable;
