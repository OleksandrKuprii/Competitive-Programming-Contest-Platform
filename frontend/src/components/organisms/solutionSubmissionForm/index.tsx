import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FC } from 'react';
import CodeViewer from '../../atoms/codeViewer';
import Defined from '../../atoms/defined';

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
    <div className="bg-secondary p-4 rounded">
      <Form>
        <Form.Row>
          <Defined value={code}>
            {(definedCode) => (
              <CodeViewer language={language}>{definedCode}</CodeViewer>
            )}
          </Defined>
        </Form.Row>

        <Form.Row>
          <Form.Control
            style={{ maxWidth: 200 }}
            as="select"
            value={language}
            onChange={(e) => selectedLanguage((e.target as any).value)}
          >
            {languages.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </Form.Control>
          <div style={{ paddingLeft: 10 }} />
          <ButtonGroup>
            <Button variant="primary" onClick={submitted}>
              Submit
            </Button>
            <Button variant="outline-danger" onClick={cancelled}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form.Row>
      </Form>
    </div>
  );
};

export default SolutionSubmissionForm;
