import * as React from 'react';
import { Table } from 'react-bootstrap';
import uuid from 'react-uuid';
import { useTranslation } from 'react-i18next';


export type CustomTableCell = string | JSX.Element;
export type CustomTableRow = CustomTableCell[];


export interface CustomTableArgs {
  headers: string[]
  rows: CustomTableRow[]
}


const CustomTable = ({ headers, rows }: CustomTableArgs) => {
  const { t } = useTranslation();
  return (
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="customhead">
        <tr>
          {headers.map((header) => (
            <th key={uuid()}>
              {t(`headers.${header}`)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={uuid()}>
            {row.map((cell) => <td key={uuid()}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CustomTable;
