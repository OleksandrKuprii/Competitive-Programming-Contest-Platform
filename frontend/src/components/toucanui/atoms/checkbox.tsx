import * as React from 'react';
import {FC, useCallback} from "react";
import styled, {keyframes} from "styled-components";
import {allColors} from "~/mixins/color";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";

interface CheckboxProps {
  label: string;
  onClick: (value: boolean) => any,
  value: boolean,
}

const NoSelectSpan = styled.span`
  user-select: none;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
`;

const checkedAnimation = keyframes`
  0% { }
  50% { transform: scale(1.1); }
  100% { }
`;

const CheckboxInput = styled.input`
  appearance: none;
  
  width: 20px;
  height: 20px;
  
  border-radius: 2px;
  border: 2px solid #888;
  
  &, &::before, &::after {
    transition: all 0.3s ease;
  }
  
  &:checked {
    animation: ${checkedAnimation} 0.3s ease;
  
    background-color: ${allColors.primary};
    border-color: ${allColors.primary};
    
    &::before,
    &::after {
      content: "";
      display: block;
      position: relative;
      background-color: white;
      width: 2px;
    }
    
    &::before {
      height: 14px;
      
      transform: rotate(40deg);
      
      left: 9px;
      bottom: 0px;
    }
    
    &::after {
      height: 6px;
      
      transform: rotate(-40deg);
      
      left: 4px;
      bottom: 7.5px;
    }
  }
`;

const Checkbox: FC<CheckboxProps> = ({ label, onClick, value }) => {
  const onChangeCallback = useCallback(() => {
    onClick(!value);
  }, []);

  return (
    <CheckboxContainer>
      <CheckboxInput type="checkbox" checked={value} onChange={onChangeCallback} />

      <Spacer left={Padding.Normal}/>

      <NoSelectSpan>{label}</NoSelectSpan>
    </CheckboxContainer>
  );
};

export default Checkbox;
