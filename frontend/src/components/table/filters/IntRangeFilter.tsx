import * as React from 'react';
import { Range } from 'react-range';
import GeneralFilter from './GeneralFilter';

interface IntRangeFilterArgs {
  header: string;
  from: number;
  to: number;
}

const IntRangeFilter: React.FunctionComponent<IntRangeFilterArgs> = ({
  header,
}) => (
  <GeneralFilter header={header}>
    <Range
      onChange={() => {}}
      values={[0, 1, 2, 3]}
      renderThumb={({ props }) => (
        <div
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...props}
          style={{
            ...props.style,
            height: '42px',
            width: '42px',
            backgroundColor: '#999',
          }}
        />
      )}
      renderTrack={({ props, children }) => (
        <div
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...props}
          style={{
            ...props.style,
            height: '6px',
            width: '100%',
            backgroundColor: '#ccc',
          }}
        >
          {children}
        </div>
      )}
    />
  </GeneralFilter>
);

export default IntRangeFilter;
