import * as React from 'react';

interface GeneralFilterArgs {
  header: string;
  children: React.ReactNode;
}

const GeneralFilter = ({ header, children }: GeneralFilterArgs) => (
  <div>
    <p className="m-0 p-1">{header}</p>

    {children}
  </div>
);

export default GeneralFilter;
