// common code for multi and single line text fields

import styled, {css} from "styled-components";

// guess what it does
export const Label = styled.label`
  height: 0;
  position: relative;
  
  padding-top: 15px;
  padding-left: 10px;
  
  display: block;
  
  pointer-events: none;
  
  width: fit-content;
  color: #555;
`;

// input or div contentEditable
export const editable = css`
  padding: 25px 10px 10px;
  background: #eee;
  
  border: none;
  border-bottom: 1px solid #ccc;
  
  width: 100%;
`;

// Wrapper for text field
export const Container = styled.div`
  overflow: hidden;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  
  width: 100%;

  &, > * {
    transition: 0.3s all ease-in-out;
  }

  > * {
    font-size: 1em;
  }
`;
