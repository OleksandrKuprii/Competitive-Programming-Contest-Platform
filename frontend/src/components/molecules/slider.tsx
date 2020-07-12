// slider.tsx - provides general multi handle slider

import * as React from 'react';
import {FC} from "react";
import styled, {css} from "styled-components";
import circle from "~/mixins/circle";
import {allColors} from "~/mixins/color";

const trackMixin = css`
  width: 100%;
  height: 100%;
  background: none;
`;

const thumbMixin = css`
  box-sizing: border-box;
  
  width: 20px;
  height: 20px;
  
  background: ${allColors.primary};
  pointer-events: auto;
  
  ${circle};
`;

const Input = styled.input`
  &::-webkit-slider-runnable-track, 
  &::-webkit-slider-thumb, & {
    -webkit-appearance: none;
  }
  
  border: none;
  
  position: absolute;
  
  width: 300px;
  height: 30px;
  
  margin: 0;
  padding: 0;
  
  background: none;
  color: #eee;
  
  cursor: grab;
  pointer-events: none;
  
  &::-webkit-slider-runnable-track {
    ${trackMixin};
  }
  
  &::-moz-range-track {
    ${trackMixin};
  }
  
  &::-webkit-slider-thumb {
    ${thumbMixin};
  }

  &::-moz-range-thumb {
    ${thumbMixin};
  }
  
  &:focus {
    outline: solid 0 transparent;
  }

  &:active { cursor: grabbing }
`;

const SliderContainer = styled.div`
  width: 300px;
  
  &::after {
    content: '';
    display: block;
    background: #aaa;
    width: 300px;
    height: 20px;
    
    border-radius: 10px;
  }
`;

interface SliderProps {
  min: number;
  max: number;
  values: number[];
  onChange: (values: number[]) => any;
}

const Slider: FC<SliderProps> = ({min, max, values, onChange}) => {
  return (
    <SliderContainer>
      {values.map((value, i) => (
        <Input
          key={i}
          type="range"
          min={min}
          max={max}
          value={value}
          step={1}
          onChange={(event) => {
            const newValues = [...values];
            newValues[i] = Number(event.target.value);
            onChange(newValues);
          }}
        />
      ))}
    </SliderContainer>
  );
};

export default Slider;
