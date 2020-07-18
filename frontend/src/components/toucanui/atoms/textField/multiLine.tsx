// provides multiline text field
// based on div with contentEditable attribute on

import * as React from 'react';
import {Component, FC, RefObject} from 'react';
import styled from "styled-components";
import {allColors} from "~/mixins/color";
import {Container, editable, Label} from "@/toucanui/atoms/textField/common";


const MultiLineContainer = styled(Container)`
  & > label {
    top: 25px;
  }

  &:focus-within > label, label.has-text {
    font-size: 0.75em;
    top: 5px;
  }
  
  &:focus-within > label {
    color: ${allColors.primary};
  }
`;


const Editable = styled.div`
  ${editable};
  
  overflow: hidden;
  width: 100%;
  resize: none;
  
  height: fit-content;
  min-height: 55px;
  
  &:focus, &:not(:empty) {
    min-height: 200px;
  
    background: rgba(0, 0, 0, 0.03);
    border-bottom-width: 2px;
  }
  
  &:focus {
    border-bottom-color: ${allColors.primary};
  }
`;

interface EditableWrapperProps {
  value?: string;

  onChange: (value: string) => any;
}

// Have to use Component to have div not being updated every time user inputs
// (which causes problems with cursor positioning).
// Really weird solution, but it's kinda better than uncontrolled element + ref.
// NOTE: cursor will jump to the begging of the text if value will be updated though script (not user input).
//       It isn't a problem because there is no way browser can know the position of cursor when value changes
//       and doing it manually is shitty way of doing things. :)
class EditableWrapper extends Component<EditableWrapperProps> {
  ref?: RefObject<HTMLDivElement>;

  constructor(props: TextFieldMultiLineProps) {
    super(props);

    this.ref = React.createRef();
  }

  shouldComponentUpdate(nextProps: any) {
    return nextProps.value !== this.ref?.current?.innerText;
  }

  render() {
    return (
      <Editable ref={this.ref} contentEditable onInput={(event) => {
        this.props.onChange((event.target as HTMLDivElement).innerText)
      }}>
        {this.props.value}
      </Editable>
    );
  }
}

interface TextFieldMultiLineProps extends EditableWrapperProps {
  label: string;
}

// We have to split the implementation into halves
// because label needs rerender while editable not.
const TextFieldMultiLine: FC<TextFieldMultiLineProps> = ({value, onChange, label}) => {
  return (
    <MultiLineContainer>
      <Label className={!value ? '' : 'has-text'}>{label}</Label>

      <EditableWrapper onChange={onChange} value={value} />
    </MultiLineContainer>
  )
}

export default TextFieldMultiLine;
