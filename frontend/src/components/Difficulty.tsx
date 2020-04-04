import * as React from 'react';
import uuid from 'react-uuid';
import { FaStar, FaStarHalf } from 'react-icons/fa';

const Difficulty = ({ difficulty }: { difficulty: number }) => {
  const halfStar = difficulty % 2 === 1;

  const stars = Math.trunc(difficulty / 2);

  return (
    <>
      {Array(stars).fill(0).map(() => (
        <FaStar color="#ffbb43" key={uuid()} />
      ))}

      {halfStar ? <FaStarHalf color="#ffbb43" /> : <></>}
    </>
  );
};

export default Difficulty;
