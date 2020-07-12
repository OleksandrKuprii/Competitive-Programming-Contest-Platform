
import * as React from 'react';
import Slider from "../src/components/molecules/slider";
import {useState} from "react";

export default { title: 'Slider' };

export const basic = () => {
  const [values, setValues] = useState([1, 10]);

  return (
    <Slider min={1} max={10} values={values} onChange={setValues} />
  );
};
