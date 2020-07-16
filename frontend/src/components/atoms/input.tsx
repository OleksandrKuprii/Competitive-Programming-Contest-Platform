import * as React from 'react';
import {ChangeEvent, FC, useCallback} from "react";
import styled from "styled-components";
import {allColors} from "~/mixins/color";


const InputContainer = styled.div`
  overflow: hidden;
  border-radius: 5px;

  &, input, label {
    transition: 0.3s all ease-in-out;
  }

  input, label {
    font-size: 1em;
  }

  label {
    height: 0;
    position: relative;
    
    padding-top: 15px;
    padding-left: 10px;
    
    top: -45px;
    left: 0;
    
    display: block;
    
    pointer-events: none;
    
    
    width: fit-content;
    color: #555;
  }
  
  input {
    padding: 25px 10px 10px;
    border: none;
    border-bottom: #ccc 1px solid;
    background: #eee;
  }
  
  input:focus ~ label,
  input:valid ~ label {
    top: -65px;
    font-size: 0.75em;
  }
  
  input:focus ~ label {
    color: ${allColors['primary']};
  }
  
  input:focus,
  input:valid {
    background: rgba(0, 0, 0, 0.03);
    border-bottom-width: 2px;
  }
  
  input:focus {
    border-bottom-color: ${allColors['primary']};
  }
`;


interface InputProps<T> {
  label: string;

  value?: T;
  onChange: (value: T) => any;

  type?: 'number' | 'text';

  wide?: boolean;
}


const Input: FC<InputProps<string | number>> = ({ label, value, onChange, type, wide }) => {
  if (wide === undefined) {
    wide = true;
  }

  const onChangeCallback = useCallback((event: ChangeEvent) => {
    onChange((event.target as HTMLInputElement).value);
  }, []);

  return (
    <InputContainer>
      <input type={type} required value={value || ''} onChange={onChangeCallback} style={wide ? {} : { width: 100 }} />
      <label>{label}</label>
    </InputContainer>
  );
};

export default Input;

