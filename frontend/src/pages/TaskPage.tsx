import * as React from 'react';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
import { Task } from '../models/interfaces';
import HtmlTextSection from '../components/atoms/htmlTextSection';
import Defined from '../components/atoms/defined';
import StyledTable from '../components/atoms/styledTable';
import SolutionDropZone from '../components/organisms/solutionDropZone';
import SolutionSubmissionForm from '../components/organisms/solutionSubmissionForm';

interface TaskPageProps {
  task: Task;
  languages: string[];
  language: string;
  code?: string;
  fileUploaded: boolean;
  onDropAccepted: (file: File) => any;
  selectedLanguage: (language: string) => any;
  cancelled: () => any;
  submit: (taskId: string) => any;
}

const TaskPage: FC<TaskPageProps> = ({
  task,
  language,
  languages,
  code,
  fileUploaded,
  onDropAccepted,
  selectedLanguage,
  cancelled,
  submit,
}) => {
  const { t } = useTranslation();

  const submittedCallback = useCallback(() => {
    submit(task.id);
  }, [task.id]);

  const sections = [
    { id: 1, text: task.description?.main },
    {
      id: 2,
      header: t('taskPage.description.inputFormat'),
      text: task.description?.inputFormat,
    },
    {
      id: 3,
      header: t('taskPage.description.outputFormat'),
      text: task.description?.outputFormat,
    },
  ];

  if (task.customSections) {
    task.customSections.forEach((section, i) => {
      sections.push({
        id: 4 + i,
        header: section.name,
        text: section.data,
      });
    });
  }

  return (
    <>
      <Row>
        <Col>
          <h1 style={{ marginBottom: 5 }}>{task.name}</h1>
          <p className="h6">
            {t('taskPage.personalResult')}
            {': '}
          </p>
          <div className="task-description">
            {sections.map((section) => (
              <HtmlTextSection
                key={section.id}
                text={section.text || ''}
                header={section.header || ''}
              />
            ))}
          </div>

          <Defined value={task.examples}>
            {(definedExamples) => (
              <StyledTable>
                <thead>
                  <tr>
                    <th>{t('headers.input')}</th>
                    <th>{t('headers.output')}</th>
                  </tr>
                </thead>
                <tbody>
                  {definedExamples.map((example) => (
                    <tr key={example.input + example.output}>
                      <td>{example.input}</td>
                      <td>{example.output}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            )}
          </Defined>
        </Col>
        <Col md="4">
          <StyledTable>
            <thead>
              <tr>
                <th>{t('headers.cpuTime')}</th>
                <th>{t('headers.realtime')}</th>
                <th>{t('headers.memory')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Defined value={task.limits?.cpuTime}>
                    {(definedCpuTime) => <>{definedCpuTime}</>}
                  </Defined>
                </td>
                <td>
                  <Defined value={task.limits?.wallTime}>
                    {(definedWallTime) => <>{definedWallTime}</>}
                  </Defined>
                </td>
                <td>
                  <Defined value={task.limits?.memory}>
                    {(definedMemory) => <>{definedMemory}</>}
                  </Defined>
                </td>
              </tr>
            </tbody>
          </StyledTable>

          <StyledTable>
            <thead>
              <tr>
                <th>{t('headers.input')}</th>
                <th>{t('headers.output')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>input.txt</td>
                <td>output.txt</td>
              </tr>
            </tbody>
          </StyledTable>
        </Col>
      </Row>

      <Row>
        <Col>
          <p>
            <b>{t('taskPage.submitSolution')}</b>
          </p>

          <SolutionDropZone
            fileUploaded={fileUploaded}
            onDropAccepted={onDropAccepted}
          >
            <SolutionSubmissionForm
              language={language}
              languages={languages}
              selectedLanguage={selectedLanguage}
              cancelled={cancelled}
              submitted={submittedCallback}
              code={code}
            />
          </SolutionDropZone>
        </Col>
      </Row>

      <div className="p-3" />
    </>
  );
};

export default TaskPage;
