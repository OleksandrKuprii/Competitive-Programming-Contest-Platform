import * as React from 'react';
import {ChangeEvent, FC, useCallback} from "react";
import styled from "styled-components";
import {background, foreground, hoverBackground, hoverForeground} from "~/mixins/color";
import { MdFileUpload } from 'react-icons/md';
import {Padding} from "~/mixins/padding";
import Spacer from "@/toucanui/atoms/spacer";


const Label = styled.label<{ variant?: string }>`
  background: ${background};
  color: ${foreground};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  border-radius: 5px;
  
  &:hover {
    background: ${hoverBackground};
    color: ${hoverForeground};
  }
  
  padding: 10px 5px;
`;


const Input = styled.input`
  display: none;
`;


interface FileUploadProps {
  onUpload: (files: FileList | null) => any;
  label: string;
}


const FileUpload: FC<FileUploadProps> = ({ onUpload, label }) => {
  const onChangeCallback = useCallback((event: ChangeEvent) => {
    onUpload((event.target as HTMLInputElement).files);
  }, []);

  return (
    <Label variant="primary">
      <MdFileUpload style={{ fontSize: 30 }} />
      <Spacer left={Padding.Normal} />
      {label}
      <Input type="file" onChange={onChangeCallback} />
    </Label>
  );
};

export default FileUpload;

