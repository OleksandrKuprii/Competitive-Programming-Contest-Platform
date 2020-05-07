import * as React from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

interface SortControlArgs {
  onDesc?: () => void;
  onAsc?: () => void;
  active?: string;
}

const Index: React.FunctionComponent<SortControlArgs> = ({
  onDesc,
  onAsc,
  active,
}) => {
  return (
    <div className="d-inline-flex" style={{ paddingLeft: 5 }}>
      <div
        className={`d-block sort-control ${
          active === 'desc' ? 'sort-control-active' : ''
        }`}
        onClick={onDesc}
        onKeyDown={onDesc}
        role="button"
        aria-hidden="true"
      >
        <MdExpandMore />
      </div>
      <div
        className={`d-block sort-control ${
          active === 'asc' ? 'sort-control-active' : ''
        }`}
        onClick={onAsc}
        onKeyDown={onDesc}
        role="button"
        aria-hidden="true"
      >
        <MdExpandLess />
      </div>
    </div>
  );
};

export default React.memo(Index);
