import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useStoreActions, useStoreState } from '../hooks/store';
import CustomTable from '../components/CustomTable';
import TaskSolutionDropZone from '../components/task/TaskSolutionDropZone';
import Loading from '../components/Loading';
import ErrorPage from './ErrorPage';
import GreatestResult from '../components/result/GreatestResult';
import TaskSolutionSubmissionForm from '../components/task/TaskSolutionSubmissionForm';
import TaskDescriptionSection from '../components/task/TaskDescriptionSection';

const TaskPage = () => {
  const { t } = useTranslation();

  const { taskAlias } = useParams();

  const task = useStoreState((state) => (taskAlias ? state.task.byId(taskAlias) : undefined));

  const fetchTask = useStoreActions((actions) => actions.task.fetchOne);

  useEffect(() => {
    if (!taskAlias) {
      return;
    }

    fetchTask(taskAlias);
  }, [fetchTask, taskAlias]);

  if (!taskAlias || !task) {
    return <ErrorPage code="notFound" />;
  }

  if (task.loading) {
    return <Loading variant="loading" />;
  }

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
            <GreatestResult taskAlias={taskAlias} />{' '}
          </p>

          <div className="task-description">
            {sections.map((section) => (
              <TaskDescriptionSection
                key={section.id}
                text={section.text || ''}
                header={section.header || ''}
              />
            ))}
          </div>

          {task.examples === undefined ? null : (
            <CustomTable
              tableName="taskExamples"
              headers={['input', 'output']}
              padding={10}
              rows={task.examples.map(({ input, output }: { input: string; output: string }) => ({
                id: `${input}-${output}`,
                row: (
                  <>
                    <td>{input}</td>
                    <td>{output}</td>
                  </>
                ),
              }))}
            />
          )}
        </Col>
        <Col md="4">
          <CustomTable
            tableName="taskLimits"
            headers={['cpuTime', 'realtime', 'memory']}
            rows={[
              {
                id: `${task.limits?.cpuTime}-${task.limits?.wallTime}-${task.limits?.memory}`,
                row: (
                  <>
                    <td>{task.limits?.cpuTime === undefined ? '' : task.limits.cpuTime}</td>
                    <td>{task.limits?.wallTime === undefined ? '' : task.limits.wallTime}</td>
                    <td>{task.limits?.memory === undefined ? '' : task.limits.memory}</td>
                  </>
                ),
              },
            ]}
          />

          <CustomTable
            tableName="inputOutput"
            headers={['input', 'output']}
            rows={[
              {
                id: 'input.txt-output.txt',
                row: (
                  <>
                    <td>input.txt</td>
                    <td>output.txt</td>
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <p>
            <b>{t('taskPage.submitSolution')}</b>
          </p>

          <TaskSolutionDropZone>
            <TaskSolutionSubmissionForm />
          </TaskSolutionDropZone>
        </Col>
      </Row>

      <div className="p-3" />
    </>
  );
};

export default TaskPage;
