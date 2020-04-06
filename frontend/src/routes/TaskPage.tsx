import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Parser as HtmlToReactParser } from 'html-to-react';
import { useStoreActions, useStoreState } from '../hooks/store';
import CustomTable from '../components/CustomTable';
import { GreatestResult } from '../components/Result';
import SolutionDropZone from '../components/SolutionDropZone';
import { Task } from '../models/taskModel';
import Loading from '../components/Loading';
import ErrorPage from './ErrorPage';

const TaskPage = () => {
  const { t } = useTranslation();

  const { taskAlias } = useParams();

  const task = useStoreState(
    (state) => state.taskSubmission.task.list.find(
      (_task: Task) => _task.alias === taskAlias,
    ),
  );

  const authLoading = useStoreState((state) => state.auth0.loading.loading);
  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);
  const token = useStoreState((state) => state.auth0.token);

  const fetchTask = useStoreActions((actions) => actions.taskSubmission.fetchTask);

  React.useEffect(() => {
    if (authLoading || taskAlias === undefined) {
      return;
    }

    if (isAuthenticated) {
      fetchTask({ alias: taskAlias, token });
      return;
    }

    fetchTask({ alias: taskAlias });
  }, [taskAlias, fetchTask, authLoading, isAuthenticated, token]);

  if (task === undefined || taskAlias === undefined) {
    return (
      <ErrorPage code="notFound" />
    );
  }

  const htmlToReactParser = new HtmlToReactParser();

  const {
    main: mainOriginal,
    inputFormat: inputFormatOriginal,
    outputFormat: outputFormatOriginal,
  } = (task.description === undefined ? {
    main: undefined,
    inputFormat: undefined,
    outputFormat: undefined,
  } : task.description);

  const cloneString = (str: string | undefined) => (` ${str === undefined ? '' : str}`).slice(1);

  const renderHtmlWithNewlines = (str: string) => htmlToReactParser.parse(str.replace('\\n', '<br/>'));

  const [main,
    inputFormat,
    outputFormat] = [mainOriginal,
    inputFormatOriginal,
    outputFormatOriginal]
    .map(cloneString)
    .map((str) => str.replace('<p>', ''))
    .map((str) => str.replace('</p>', ''))
    .map(renderHtmlWithNewlines);

  if (task.loading || authLoading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <Row>
        <Col>
          <h1 style={{ marginBottom: 5 }}>{task.name}</h1>
          <p className="h6">
            {t('taskPage.personalResult')}
            {': '}
            <GreatestResult taskAlias={taskAlias} />
            {' '}
          </p>
          <blockquote>{main}</blockquote>
          <p className="h5 font-weight-bold">
            {t('taskPage.description.inputFormat')}
          </p>
          <blockquote>{inputFormat}</blockquote>
          <p className="h5 font-weight-bold">
            {t('taskPage.description.outputFormat')}
          </p>
          <blockquote>{outputFormat}</blockquote>
          <p className="h5 font-weight-bold">
            {t('taskPage.examples')}
          </p>

          {task.examples === undefined ? null
            : (
              <CustomTable
                tableName="taskExamples"
                headers={['input', 'output']}
                padding={10}
                rows={task.examples.map(
                  ({
                    input,
                    output,
                  }: { input: string, output: string }) => (
                    {
                      id: `${input}-${output}`,
                      row: (
                        <>
                          <td>
                            {renderHtmlWithNewlines(input)}
                          </td>
                          <td>
                            {renderHtmlWithNewlines(output)}
                          </td>
                        </>
                      ),
                    }),
                )}
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
                    <td>
                      {task.limits?.cpuTime === undefined
                        ? ''
                        : task.limits.cpuTime}
                    </td>
                    <td>
                      {task.limits?.wallTime === undefined
                        ? ''
                        : task.limits.wallTime}
                    </td>
                    <td>
                      {task.limits?.memory === undefined
                        ? ''
                        : task.limits.memory}
                    </td>
                  </>
                ),
              }]}
          />

          <CustomTable
            tableName="inputOutput"
            headers={['input', 'output']}
            rows={[
              {
                id: 'input.txt-output.txt',
                row: (
                  <>
                    <td>
                      input.txt
                    </td>
                    <td>
                      output.txt
                    </td>
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <p><b>{t('taskPage.submitSolution')}</b></p>

          <SolutionDropZone taskAlias={taskAlias} />
        </Col>
      </Row>
    </>
  );
};

export default TaskPage;
