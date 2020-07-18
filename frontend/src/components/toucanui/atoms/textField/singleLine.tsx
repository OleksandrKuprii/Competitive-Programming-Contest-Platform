// provides singleLine text field
// based on input

import * as React from 'react';
import {ChangeEvent, FC, useCallback} from 'react';
import styled from "styled-components";
import {allColors} from "~/mixins/color";
import {Container, editable, Label} from "@/toucanui/atoms/textField/common";

const Editable = styled.input`
  ${editable};
  
  & ~ label {
    top: -45px;
    left: 0;
  }
  
  &:focus ~ label,
  &:not([value=""]) ~ label {
    top: -65px;
    font-size: 0.75em;
  }
  
  &:focus ~ label {
    color: ${allColors['primary']};
  }
  
  &:focus,
  &:not([value=""]) {
    background: rgba(0, 0, 0, 0.03);
    border-bottom-width: 2px;
  }
  
  &:focus {
    border-bottom-color: ${allColors['primary']};
  }
`;


interface TextFieldProps<T> {
  label: string;

  value?: T;
  onChange: (value: T) => any;

  type?: 'number' | 'text';
}


const TextField: FC<TextFieldProps<string | number>> = ({label, value, onChange, type}) => {
  const onChangeCallback = useCallback((event: ChangeEvent) => {
    onChange((event.target as HTMLInputElement).value);
  }, []);

  return (
    <Container>
      <Editable type={type} required value={value || ''} onChange={onChangeCallback} />
      <Label>{label}</Label>
    </Container>
  );
};

export default TextField;

