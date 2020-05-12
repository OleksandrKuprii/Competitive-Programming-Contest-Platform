import * as React from 'react';
import { ReactNode } from 'react';

interface DataFilterProps<Item> {
  tests: ((item: Item) => boolean)[];
  items: Item[];
  children: (items: Item[]) => ReactNode;
}

function DataFilter<Item>({ items, tests, children }: DataFilterProps<Item>) {
  return (
    <>{children(items.filter((item) => tests.every((test) => test(item))))}</>
  );
}

export default DataFilter;
