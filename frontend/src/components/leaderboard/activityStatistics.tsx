import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Data {
  date: string;
  visitors: number;
  solved: number;
}
function ActivityStatistics({ data }: { data: Data[] }) {
  return (
    <AreaChart
      width={730}
      height={250}
      data={data}
      margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorSolvedtasks" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Area
        name="Active users"
        type="monotone"
        dataKey="visitors"
        stroke="#8884d8"
        fillOpacity={1}
        fill="url(#colorVisitors)"
      />
      <Area
        name="Solved tasks"
        type="monotone"
        dataKey="solved"
        stroke="#82ca9d"
        fillOpacity={1}
        fill="url(#colorSolvedtasks)"
      />
    </AreaChart>
  );
}
export default ActivityStatistics;
