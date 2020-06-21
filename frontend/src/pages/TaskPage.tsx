import * as React from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from '@/atoms/grid';
import Table from '@/molecules/table';
import HtmlTextSection from '@/molecules/htmlTextSection';
import Defined from '@/helpers/defined';
import { Title } from '@/atoms/typography';
import Paper from '@/atoms/paper';
import TaskFromURL from '@/providers/taskFromURL';
import TaskDescriptionSections from '@/providers/taskDescriptionSections';
import styled from 'styled-components';
import WithSubmissionArea from '@/templates/withSubmissionArea';

const Td = styled.td`
  vertical-align: top;
  white-space: pre-line;
`;

const TaskPage: FC = () => {
  const { t } = useTranslation();

  return (
    <TaskFromURL>
      {(task) => (
        <WithSubmissionArea taskId={task.id}>
          <Title>{task.name}</Title>
          <Row>
            <Col size={3}>
              <Paper>
                <TaskDescriptionSections task={task}>
                  {(sections) =>
                    sections.map((section) => (
                      <HtmlTextSection
                        key={section.id}
                        text={section.text || ''}
                        header={section.header || ''}
                      />
                    ))
                  }
                </TaskDescriptionSections>
              </Paper>


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
                          <Td>{example.input}</Td>
                          <Td>{example.output}</Td>
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

        </WithSubmissionArea>
      )}
    </TaskFromURL>
  );
};

export default TaskPage;
