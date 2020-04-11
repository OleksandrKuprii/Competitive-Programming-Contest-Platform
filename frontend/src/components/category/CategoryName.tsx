import * as React from 'react';
import { useStoreState } from '../../hooks/store';

const CategoryName = ({ id }: { id: string | undefined }) => {
  const category = useStoreState((state) => (id ? state.category.byId(id) : undefined));

  if (category) {
    return (
      <>
        {category.name}
      </>
    );
  }

  return <></>;
};

export default CategoryName;
