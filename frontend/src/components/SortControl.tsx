import * as React from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

const SortControl = () => {
  return (
    <div className="d-inline-flex" style={{ paddingLeft: 5 }}>
      <span className="d-block sort-control">
        <MdExpandLess />
      </span>

      <span className="d-block sort-control">
        <MdExpandMore />
      </span>
    </div>
  );
};

export default SortControl;
