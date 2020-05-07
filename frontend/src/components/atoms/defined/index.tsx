import * as React from 'react';
import { ReactNode } from 'react';

interface DefinedProps<T> {
  children: (definedValue: T) => ReactNode;
  value: T | undefined | null;
  fallback?: ReactNode;
}

function Defined<T>({ value, children, fallback }: DefinedProps<T>) {
  if (value === undefined || value === null) {
    return <>{fallback}</>;
  }

  return <>{children(value)}</>;
}

export default Defined;
