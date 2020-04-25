import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface GeneralFilterArgs {
  header?: string;
  additionalText?: string;
  children: React.ReactNode;
}

const GeneralFilter = ({
  header,
  children,
  additionalText,
}: GeneralFilterArgs) => {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary rounded">
      {header ? (
        <p className="text-center m-0 big font-weight-bold p-2">
          {t(`filters.${header}`)} {additionalText}
        </p>
      ) : (
        <div style={{ paddingTop: 24 }} />
      )}

      <div>{children}</div>
    </div>
  );
};

export default React.memo(GeneralFilter);
