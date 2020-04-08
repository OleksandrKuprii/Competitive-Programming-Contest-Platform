import React from 'react';
import {BarChart, Tooltip, Legend, Bar, YAxis, CartesianGrid, XAxis} from 'recharts'
import { render } from '@testing-library/react';


const data = [
    {name: 'Python', "Correct": 4000, "Not a full answer": 2400,"Incorrect": 2400},
    {name: 'C', "Correct": 3000, "Not a full answer": 1398,"Incorrect": 2210},
    {name: 'Pascal', "Correct": 2000, "Not a full answer": 9800,"Incorrect": 2290},
    {name: 'Ruby', "Correct": 2780, "Not a full answer": 3908,"Incorrect": 2000},
];
const dataToPercents = (data) => {
    let sumOfAll = 0
    let res = []
    for (let i=0;i<data.length;i++){
        sumOfAll-=-data[i]["Correct"]
        sumOfAll-=-data[i]["Not a full answer"]
        sumOfAll-=-data[i]["Incorrect"]
    }
    let bar = {}
    for (let i=0;i<data.length;i++){
        bar = {}
        bar['name'] = data[i]['name']
        bar['Correct'] = Math.round((data[i]['Correct']*10000)/sumOfAll)/100
        bar['Not a full answer'] = Math.round((data[i]['Not a full answer']*10000)/sumOfAll)/100
        bar['Incorrect'] = Math.round((data[i]['Incorrect']*10000)/sumOfAll)/100
        res.push(bar)
    };
    return res
};
const SimpleBarChart = () => {
  render () 
    return (
     <BarChart width={700} height={300} data={dataToPercents(data)}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}>
     <CartesianGrid strokeDasharray="1 1"/>
     <XAxis dataKey="name"/>
     <YAxis unit = '%'/>
     <Tooltip formatter={(value) => value + '%'}/>
     <Legend />
     <Bar dataKey="Correct" fill="#82ca9d" />
     <Bar dataKey="Not a full answer" fill="#edcf5f" />
     <Bar dataKey="Incorrect" fill = '#db504a'/>
    </BarChart>
  );
};
export default SimpleBarChart;