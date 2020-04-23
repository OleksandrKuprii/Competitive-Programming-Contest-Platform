import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

interface TableShowOptionsArgs {
  onApply: () => void;
}

const TableShowOptions: React.FunctionComponent<TableShowOptionsArgs> = ({
  onApply,
}) => {
  return (
    <Form inline>
      <Button onClick={onApply}>Apply</Button>
    </Form>
  );
};

export default TableShowOptions;
