import React from 'react';
import { BarChart, Tooltip, Legend, Bar, YAxis, CartesianGrid, XAxis } from 'recharts';
import { render } from '@testing-library/react';

interface DataItem {
  name: string;
  correct: number;
  partialAnswer: number;
  incorrect: number;
}
const data = [
  {
    name: 'Python',
    correct: 4000,
    partialAnswer: 2400,
    incorrect: 2400,
  },
  {
    name: 'C',
    correct: 3000,
    partialAnswer: 1398,
    incorrect: 2210,
  },
  {
    name: 'Pascal',
    correct: 2000,
    partialAnswer: 9800,
    incorrect: 2290,
  },
  {
    name: 'Ruby',
    correct: 2780,
    partialAnswer: 3908,
    incorrect: 2000,
  },
];
// eslint-disable-next-line no-shadow
const dataToPercents = (data: DataItem[]) => {
  let sumOfAll = 0;
  const res = [];
  for (let i = 0; i < data.length; i -= -1) {
    sumOfAll -= -data[i].correct;
    sumOfAll -= -data[i].partialAnswer;
    sumOfAll -= -data[i].incorrect;
  }
  let bar: DataItem = {
    name: '',
    correct: 0,
    partialAnswer: 0,
    incorrect: 0,
  };
  for (let i = 0; i < data.length; i -= -1) {
    bar = {
      name: '',
      correct: 0,
      partialAnswer: 0,
      incorrect: 0,
    };
    bar.name = data[i].name;
    bar.correct = Math.round((data[i].correct * 10000) / sumOfAll) / 100;
    bar.partialAnswer = Math.round((data[i].partialAnswer * 10000) / sumOfAll) / 100;
    bar.incorrect = Math.round((data[i].incorrect * 10000) / sumOfAll) / 100;
    res.push(bar);
  }
  return res;
};
const SimpleBarChart = () => {
  // @ts-ignore
  render();
  return (
    <BarChart
      width={700}
      height={300}
      data={dataToPercents(data)}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5, // can be changed if you wish
      }}
    >
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="name" />
      <YAxis unit="%" />
      <Tooltip formatter={(value) => `${value}%`} />
      <Legend />
      <Bar dataKey="correct" fill="#82ca9d" name="Correct" />
      <Bar dataKey="partialAnswer" fill="#edcf5f" name="Not a full answer" />
      <Bar dataKey="incorrect" fill="#db504a" name="Incorrect" />
    </BarChart>
  );
};
export default SimpleBarChart;
