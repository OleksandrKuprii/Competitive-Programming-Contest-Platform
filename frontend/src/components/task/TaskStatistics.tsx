import React from 'react';
import { BarChart, Tooltip, Legend, Bar, YAxis, CartesianGrid, XAxis } from 'recharts';
import { render } from '@testing-library/react';

interface DataItem {
  lang: string;
  full: number;
  partial: number;
  zero: number;
}
const data = [
  {
    lang: 'Python',
    full: 4000,
    partial: 2400,
    zero: 2400,
  },
  {
    lang: 'C',
    full: 3000,
    partial: 1398,
    zero: 2210,
  },
  {
    lang: 'Pascal',
    full: 2000,
    partial: 9800,
    zero: 2290,
  },
  {
    lang: 'Ruby',
    full: 2780,
    partial: 3908,
    zero: 2000,
  },
];
// eslint-disable-next-line no-shadow
const dataToPercents = (data: DataItem[]) => {
  let sumOfAll = 0;
  const res = [];
  for (let i = 0; i < data.length; i -= -1) {
    sumOfAll -= -data[i].full;
    sumOfAll -= -data[i].partial;
    sumOfAll -= -data[i].zero;
  }
  let bar: DataItem = {
    lang: '',
    full: 0,
    partial: 0,
    zero: 0,
  };
  for (let i = 0; i < data.length; i -= -1) {
    bar = {
      lang: '',
      full: 0,
      partial: 0,
      zero: 0,
    };
    bar.lang = data[i].lang;
    bar.full = Math.round((data[i].full * 10000) / sumOfAll) / 100;
    bar.partial = Math.round((data[i].partial * 10000) / sumOfAll) / 100;
    bar.zero = Math.round((data[i].zero * 10000) / sumOfAll) / 100;
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
      <XAxis dataKey="lang" />
      <YAxis unit="%" />
      <Tooltip formatter={(value) => `${value}%`} />
      <Legend />
      <Bar dataKey="full" fill="#82ca9d" name="Correct" />
      <Bar dataKey="partial" fill="#edcf5f" name="Not a full answer" />
      <Bar dataKey="zero" fill="#db504a" name="Incorrect" />
    </BarChart>
  );
};
export default SimpleBarChart;
