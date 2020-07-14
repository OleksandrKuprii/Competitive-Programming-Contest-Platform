import * as React from 'react';
import { FC, useCallback } from 'react';
import CodeViewer from '@/molecules/codeViewer';
import Defined from '@/helpers/defined';
import Button from '@/atoms/button';
import { Grid, Row } from '@/atoms/grid';
import StyledSelect from '@/molecules/select';
import { useStoreState, useStoreActions } from '~/hooks/store';

interface SolutionSubmissionForm {
  taskId: string;
}

const SolutionSubmissionForm: FC<SolutionSubmissionForm> = ({ taskId }) => {
  const code = useStoreState((state) => state.solutionSubmission.code);
  const language = useStoreState((state) => state.solutionSubmission.language);

  const selectedLanguage = useStoreActions(
    (actions) => actions.solutionSubmission.selectedLanguage,
  );
  const submit = useStoreActions(
    (actions) => actions.solutionSubmission.submit,
  );
  const cancelled = useStoreActions(
    (actions) => actions.solutionSubmission.canceled,
  );

  const canceledCallback = useCallback(() => {
    cancelled();
  }, [cancelled]);

  const submittedCallback = useCallback(() => {
    submit(taskId);
  }, [submit, taskId]);

  const languages = ['python3', 'python2', 'c++', 'c', 'pascal'];

  return (
    <Grid>
      <Row>
        <Defined value={code}>
          {(definedCode) => (
            <CodeViewer language={language}>{definedCode}</CodeViewer>
          )}
        </Defined>
      </Row>

      <Row>
        <div style={{ width: 200 }}>
          {/*<StyledSelect*/}
          {/*  value={{ value: language, label: language }}*/}
          {/*  options={languages.map((lang) => ({ value: lang, label: lang }))}*/}
          {/*  onChange={(option) => {*/}
          {/*    if (option === null || option === undefined) {*/}
          {/*      selectedLanguage('python3');*/}
          {/*      return;*/}
          {/*    }*/}

          {/*    // @ts-ignore*/}
          {/*    selectedLanguage(option.value);*/}
          {/*  }}*/}
          {/*/>*/}
        </div>

        <Button onClick={submittedCallback}>Submit</Button>

        <Button variant="danger" onClick={canceledCallback}>
          Cancel
        </Button>
      </Row>
    </Grid>
  );
};

export default SolutionSubmissionForm;
