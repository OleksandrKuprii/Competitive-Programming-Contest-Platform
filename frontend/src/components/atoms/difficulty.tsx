import * as React from 'react';
import { FC } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import styled, {css} from "styled-components";

interface DifficultyProps {
  difficulty: number;
}

const goDown = css`
  transform: translateY(16%);
`;

const StyledStar = styled(FaStar)`
  ${goDown};
`;

const StyledHalfStar = styled(FaStarHalf)`
  ${goDown};
`

const Difficulty: FC<DifficultyProps> = ({ difficulty }) => {
  const halfStar = difficulty % 2 === 1;

  const stars = Math.trunc(difficulty / 2);

  return (
    <>
      {Array.from({ length: stars }, (x, i) => i).map((i) => (
        <StyledStar key={i} color="#ffbb43" />
      ))}

      {halfStar && <StyledHalfStar color="#ffbb43" />}
    </>
  );
};

export default React.memo(Difficulty);
