import { useStoreActions, useStoreState } from 'easy-peasy';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CustomTable from '../components/CustomTable';
import { GreatestResult } from '../components/Result';
import SolutionDropZone from '../components/SolutionDropZone';
import { Task } from '../components/TaskList';

const TaskPage = () => {
  const { t } = useTranslation();

  const { taskAlias } = useParams();

  const task: Task = useStoreState(
    (state) => state.publictasks.find(
      (_task: Task) => _task.alias === taskAlias,
    ),
  );

  const submitSubmission = useStoreActions((actions: any) => actions.submission.submitSubmission);

  const onSubmit = React.useCallback(() => {
    submitSubmission({ taskAlias });
  }, [taskAlias, submitSubmission]);

  return (
    <>
      <Row>
        <Col>
          <h1 style={{ marginBottom: 5 }}>{task.taskName}</h1>
          <p className="h6">
            {t('taskpage.personalResult')}
            {': '}
            <GreatestResult taskAlias={taskAlias} />
            {' '}
          </p>
          <blockquote>{task.description.main}</blockquote>
          <p className="h5" style={{ margin: 0, paddingTop: 20, paddingBottom: 10 }}>
            <b>
              {t('taskpage.description.inputformat')}
            </b>
          </p>
          <blockquote>{task.description.input_format}</blockquote>
          <p className="h5">
            <b>
              {t('taskpage.description.outputformat')}
            </b>
          </p>
          <blockquote>{task.description.output_format}</blockquote>
          <p className="h5">
            <b>
              {t('taskpage.examples')}
            </b>
          </p>

          <CustomTable
            headers={['input', 'output']}
            rows={task.examples.map(({ input, output }) => ([
              (input),
              (output),
            ]))}
          />
        </Col>
        <Col md="4">
          <p className="h5 center">
            Limits
          </p>
          <CustomTable
            headers={['cputime', 'realtime', 'memory']}
            rows={[[task.limits.cpu_time.toString(),
              task.limits.wall_time.toString(),
              task.limits.memory.toString()]]}
          />

          <CustomTable headers={['input', 'output']} rows={[['input.txt', 'output.txt']]} />
        </Col>
      </Row>

      <Row>
        <Col>
          <p><b>{t('taskpage.submitsolution')}</b></p>

          <SolutionDropZone onSubmit={onSubmit} />
        </Col>
      </Row>
    </>
  );
};

export default TaskPage;
