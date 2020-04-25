import * as React from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';

const TaskDifficulty = ({ difficulty }: { difficulty: number }) => {
  const halfStar = difficulty % 2 === 1;

  const stars = Math.trunc(difficulty / 2);

  return (
    <>
      {Array.from({ length: stars }, (x, i) => i).map((i) => (
        <FaStar key={i} color="#ffbb43" />
      ))}

      {halfStar ? <FaStarHalf color="#ffbb43" /> : <></>}
    </>
  );
};

export default React.memo(TaskDifficulty);
