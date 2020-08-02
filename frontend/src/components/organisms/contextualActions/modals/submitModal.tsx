import * as React from 'react';
import {ChangeEvent, FC, useCallback, useState} from "react";
import Modal from "@/molecules/modal";
import FileUpload from "@/toucanui/molecules/fileUpload";
import {useStoreActions, useStoreState} from "~/hooks/store";
import CodeViewer from "@/molecules/codeViewer";
import Select from "@/molecules/select";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import styled, {keyframes} from "styled-components";


const appear = keyframes`
  from { max-height: 0; }
  to { max-height: 40vh; }
`;

const DivAppear = styled.div`
  animation: 0.3s ease-in-out ${appear};
  overflow: hidden;
  max-height: 40vh;
  height: 40vh;
`;

const disappear = keyframes`
  from { max-height: 40vh }
  to { max-height: 0; }
`;

const DivDisappear = styled.div`
  overflow: hidden;
  animation: 0.3s ease-in-out ${disappear};
  height: 40vh;
  max-height: 0;
`;


const languages = ['python3', 'python2', 'c++', 'c', 'pascal'];
const languageOptions = languages.map(language => ({label: language, value: language}));


interface SubmitModalProps {
  onClose: () => any;
  taskId: string;
  show: boolean;
}


const SubmitModal: FC<SubmitModalProps> = ({onClose, taskId, show }) => {
  const [uploaded, setUploaded] = useState(false);

  const code = useStoreState(state => state.solutionSubmission.code);
  const language = useStoreState(state => state.solutionSubmission.language);

  const uploadFile = useStoreActions(actions => actions.solutionSubmission.uploadFile);
  const canceled = useStoreActions(actions => actions.solutionSubmission.canceled);
  const selectedLanguage = useStoreActions(actions => actions.solutionSubmission.selectedLanguage);
  const submit = useStoreActions(actions => actions.solutionSubmission.submit);

  const onUploadCallback = useCallback((files: FileList | null) => {
    if (!files) {
      return;
    }

    uploadFile(files[0]);
  }, []);

  return (
    <Modal
      show={show}
      title="Submit"
      onClose={onClose}
      wide
      additionalActions={code ?
        [
          {
            onClick: () => {
              onClose();
              submit(taskId);
            },
            label: 'Submit',
            variant: 'danger',
            disabled: !language
          },
          {
            onClick: () => {
              setUploaded(true);
              canceled();
            },
            label: 'Cancel',
            variant: 'light',
            disabled: !language
          }
        ] : undefined}>
      <Select
        options={languageOptions}
        placeholder="Language"
        value={{label: language, value: language}}
        onChange={(value) => {
          if (!value || Array.isArray(value)) {
            return;
          }

          // @ts-ignore
          selectedLanguage(value.value);
        }}/>

      <Spacer top={Padding.Medium}/>

      {code
        ? <DivAppear><CodeViewer language="python">{code}</CodeViewer></DivAppear>
        : (
          <>
            {uploaded && <DivDisappear/>}
            <FileUpload onUpload={onUploadCallback} label="Upload file with source code"/>
          </>
        )}
    </Modal>
  );
};

export default SubmitModal;
