import * as React from 'react';

interface GeneralFilterArgs {
  header: string;
  children: React.ReactNode;
}

const GeneralFilter = ({ header, children }: GeneralFilterArgs) => (
  <>
    <p className="m-0">{header}</p>

    <div>{children}</div>
  </>
);

export default GeneralFilter;
