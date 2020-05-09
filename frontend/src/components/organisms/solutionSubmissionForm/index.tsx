import * as React from 'react';
import { FC } from 'react';
import CodeViewer from '../../atoms/codeViewer';
import Defined from '../../helpers/defined';
import Button from '../../atoms/button';
import { Grid, Row } from '../../atoms/grid';
import { HorizontalSpacer, Spacer } from '../../atoms/spacers';
import StyledSelect from '../../atoms/styledSelect';

interface SolutionSubmissionFormProps {
  code?: string;
  language: string;
  languages: string[];
  selectedLanguage: (language: string) => any;
  cancelled: () => any;
  submitted: () => any;
}

const SolutionSubmissionForm: FC<SolutionSubmissionFormProps> = ({
  code,
  language,
  languages,
  selectedLanguage,
  submitted,
  cancelled,
}) => {
  return (
    <Grid>
      <Row>
        <Defined value={code}>
          {(definedCode) => (
            <CodeViewer language={language}>{definedCode}</CodeViewer>
          )}
        </Defined>
      </Row>

      <Spacer size={20} />

      <Row>
        <div style={{ width: 200 }}>
          <StyledSelect
            value={{ value: language, label: language }}
            options={languages.map((lang) => ({ value: lang, label: lang }))}
            onChange={(option) => {
              if (option === null || option === undefined) {
                selectedLanguage('python3');
                return;
              }

              // @ts-ignore
              selectedLanguage(option.value);
            }}
          />
        </div>

        <HorizontalSpacer size={10} />

        <Button onClick={submitted}>Submit</Button>

        <Button variant="danger" onClick={cancelled}>
          Cancel
        </Button>
      </Row>
    </Grid>
  );
};

export default SolutionSubmissionForm;
