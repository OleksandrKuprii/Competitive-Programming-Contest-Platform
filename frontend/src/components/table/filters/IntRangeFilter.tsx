import * as React from 'react';
import { getTrackBackground, Range } from 'react-range';
import { useState } from 'react';
import GeneralFilter from './GeneralFilter';

interface IntRangeFilterArgs {
  header: string;
  from: number;
  to: number;
  initialValues: number[];
  onFinalChange: (values: number[]) => void;
}

const IntRangeFilter: React.FunctionComponent<IntRangeFilterArgs> = ({
  header,
  from,
  to,
  initialValues,
  onFinalChange,
}) => {
  const [values, setValues] = useState(initialValues);

  return (
    <GeneralFilter header={header} additionalText={`${values[0]}-${values[1]}`}>
      <div
        className="bg-primary rounded"
        style={{ padding: '0 25px', height: 38 }}
      >
        <Range
          onChange={(v) => {
            setValues(v);
          }}
          onFinalChange={onFinalChange}
          min={from}
          max={to}
          values={values}
          renderThumb={({ props, isDragged }) => (
            <div
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...props}
              style={{
                ...props.style,
                height: '21px',
                width: '21px',
                borderRadius: '2px',
                backgroundColor: '#111',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 1px 3px #000',
              }}
            >
              <div
                style={{
                  height: '8px',
                  width: '2.5px',
                  backgroundColor: isDragged ? '#548BF4' : '#CCC',
                }}
              />
            </div>
          )}
          renderTrack={({ props, children }) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values,
                    colors: ['#555', '#548BF4', '#555'],
                    min: from,
                    max: to,
                  }),
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
          )}
        />
      </div>
    </GeneralFilter>
  );
};

export default React.memo(IntRangeFilter);
