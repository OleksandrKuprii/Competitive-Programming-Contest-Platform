import * as React from 'react';
import { ReactNode } from 'react';

interface DataSortProps<Item, Value> {
  items: Item[];

  value: (item: Item) => Value;

  order: number;

  children: (items: Item[]) => ReactNode;
}

const customCompare = (order: number) => (a: any, b: any) => {
  if (order === 0) {
    return 0;
  }

  if (a === undefined && b === undefined) {
    return 0;
  }

  if (a === undefined) {
    return -order;
  }

  if (b === undefined) {
    return order;
  }

  if (a > b) {
    return order;
  }

  if (b > a) {
    return -order;
  }

  return 0;
};

function DataSort<Item, Value>({
  items,
  value,
  children,
  order,
}: DataSortProps<Item, Value>) {
  const compare = customCompare(order);
  const sorted = items.sort((a, b) => compare(value(a), value(b)));

  return <>{children(sorted)}</>;
}

export default DataSort;
