import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { Row, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import uuid from 'react-uuid';
import { Task } from '../components/TaskList';
import SolutionDropZone
  from '../components/SolutionDropZone';
import MyResult from '../components/MyResult';
import getSubmissionWithGreatestResult from '../utils/getSubmissionWithGreatestResult';

const TaskPage = () => {
  const { t } = useTranslation();

  const { taskAlias } = useParams();

  const task: Task = useStoreState(
    (state) => state.publictasks.find(
      (_task: Task) => _task.alias === taskAlias,
    ),
  );

  const greatestSubmission = useStoreState((state: any) => {
    return getSubmissionWithGreatestResult(state.submissions, task.alias);
  });

  const points: number = greatestSubmission?.points === undefined ? -1 : greatestSubmission.points;
  const status: string = greatestSubmission?.status === undefined ? 'UNKNOWN' : greatestSubmission.status;

  return (
    <>
      <Row>
        <Col md="9">
          <h1>{task.taskName}</h1>
          <p className="lead">
            Personal result:
            {' '}
            <MyResult points={points} status={status} />
            {' '}
          </p>
          <p>{task.description.main}</p>
          <h3>{t('taskpage.description.inputformat')}</h3>
          <p>{task.description.input_format}</p>
          <h3>{t('taskpage.description.outputformat')}</h3>
          <p>{task.description.output_format}</p>
          <h3>{t('taskpage.examples')}</h3>
          <Table size="sm" striped hover variant="dark" borderless>
            <thead>
              <tr>
                <th>Input</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              {task.examples.map((example: { input: string, output: string }) => (
                <tr key={uuid()}>
                  <td>{example.input}</td>
                  <td>{example.output}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md="3">
          <p>
            <b>{t('taskpage.limits.cpu')}</b>
            :
            {' '}
            {task.limits.cpu_time}
            ms
          </p>
          <p>
            <b>{t('taskpage.limits.wall')}</b>
            :
            {' '}
            {task.limits.wall_time}
            ms
          </p>
          <p>
            <b>{t('taskpage.limits.memory')}</b>
            :
            {' '}
            {task.limits.memory}
            mb
          </p>

          <hr />

          <p>
            <b>{t('taskpage.inputfile')}</b>
            : input.txt
          </p>
          <p>
            <b>{t('taskpage.outputfile')}</b>
            : output.txt
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <p><b>{t('taskpage.submitsolution')}</b></p>

          <SolutionDropZone />
        </Col>
      </Row>
    </>
  );
};

export default TaskPage;
