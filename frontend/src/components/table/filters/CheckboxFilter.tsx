import * as React from 'react';
import { useTranslation } from 'react-i18next';
import GeneralFilter from './GeneralFilter';

interface CheckboxFilterArgs {
  header: string;
  options: {
    header: string;
  }[];
  onClick: (values: boolean[]) => void;
  checked: boolean[];
  labelClassNames?: string[];
}

const CheckboxFilter = ({
  options,
  header,
  checked,
  onClick,
  labelClassNames,
}: CheckboxFilterArgs) => {
  const { t } = useTranslation();

  return (
    <GeneralFilter header={header}>
      <div
        className="bg-primary rounded p-2 d-flex justify-content-center"
        style={{ height: 38, userSelect: 'none' }}
        unselectable="on"
      >
        {options.map(({ header: h }, i) => (
          <div className="custom-control custom-control-inline custom-checkbox">
            <input
              type="checkbox"
              checked={checked[i]}
              className="custom-control-input"
              id={`filter-checkbox-${h}`}
              onChange={(e) => {
                const newChecked = checked
                  .concat()
                  .map((flag, index) =>
                    index === i ? e.target.checked : flag,
                  );

                onClick(newChecked);
              }}
            />
            <label
              className={`custom-control-label ${
                labelClassNames ? labelClassNames[i] : ''
              }`}
              htmlFor={`filter-checkbox-${h}`}
            >
              {t(`filters.${h}`)}
            </label>
          </div>
        ))}
      </div>
    </GeneralFilter>
  );
};

export default CheckboxFilter;
