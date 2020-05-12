import { TaskRating } from '~/typings/entities/task';

const getRatingPercentage = (rating: TaskRating) => {
  const sum = rating.zero + rating.partial + rating.correct;

  return {
    correctPercentage: sum !== 0 ? (rating.correct / sum) * 100 : 0,
    partialPercentage: sum !== 0 ? (rating.partial / sum) * 100 : 0,
    zeroPercentage: sum !== 0 ? (rating.zero * 100) / sum : 0,
  };
};

export default getRatingPercentage;
