import * as React from 'react';
import uuid from 'react-uuid';
import { MdStar, MdStarHalf } from 'react-icons/md';

const Difficulty = ({ difficulty }: { difficulty: number }) => {
  const halfStar = difficulty % 2 === 1;

  const stars = Math.trunc(difficulty / 2);

  return (
    <>
      {Array(stars).fill(0).map(() => (
        <MdStar color="#ffbb43" key={uuid()} />
      ))}

      {halfStar ? <MdStarHalf color="#ffbb43" /> : <></>}
    </>
  );
};

export default Difficulty;
