import * as React from 'react';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from '@/atoms/grid';
import SolutionSubmissionForm from '@/organisms/solutionSubmissionForm';
import Table from '@/molecules/table';
import HtmlTextSection from '@/molecules/htmlTextSection';
import Defined from '@/helpers/defined';
import SolutionDropZone from '@/organisms/solutionDropZone';
import { Spacer } from '@/atoms/spacers';
import { Title } from '@/atoms/typography';
import Paper from '@/atoms/paper';
import { Task } from '~/models/interfaces';

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

  const { id } = task;

  const submittedCallback = useCallback(() => {
    submit(id);
  }, [submit, id]);

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
      <Title>{task.name}</Title>
      <Row>
        <Col size={3}>
          <Paper>
            {sections.map((section) => (
              <HtmlTextSection
                key={section.id}
                text={section.text || ''}
                header={section.header || ''}
              />
            ))}
          </Paper>

          <Spacer size={20} />

          <Defined value={task.examples}>
            {(definedExamples) => (
              <Table>
                <thead>
                  <tr>
                    <th>{t('headers.input')}</th>
                    <th>{t('headers.output')}</th>
                  </tr>
                </thead>
                <tbody>
                  {definedExamples.map((example) => (
                    <tr key={example.input + example.output}>
                      <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{example.input}</td>
                      <td style={{ whiteSpace: 'pre-line', verticalAlign: 'top' }}>{example.output}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Defined>
        </Col>
        <Col>
          <Table>
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
          </Table>

          <Spacer size={10} />

          <Table>
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
          </Table>
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

      <Spacer />
    </>
  );
};

export default TaskPage;
