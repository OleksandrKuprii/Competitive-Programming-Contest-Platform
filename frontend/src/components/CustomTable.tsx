import * as React from 'react';
import uuid from 'react-uuid';
import { useTranslation } from 'react-i18next';
import Table from 'react-bootstrap/Table';


export type CustomTableCell = string | JSX.Element;
export type CustomTableRow = CustomTableCell[];


export interface CustomTableArgs {
  headers: string[]
  rows: CustomTableRow[]
  padding?: number
}


const CustomTable = ({ headers, rows, padding }: CustomTableArgs) => {
  const { t } = useTranslation();
  return (
    <Table hover variant="dark" borderless size="sm" striped>
      <thead className="thead-dark">
        <tr>
          {headers.map((header) => (
            <th key={uuid()} style={{ paddingLeft: padding }}>
              {t(`headers.${header}`)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={uuid()}>
            {row.map((cell) => <td key={uuid()} style={{ padding }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CustomTable;
