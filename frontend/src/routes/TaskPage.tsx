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

const TaskPage = () => {
  const { t } = useTranslation();

  const { taskAlias } = useParams();

  const task: Task | undefined = useStoreState(
    (state) => state.taskSubmission.task.list.find(
      (_task: Task) => _task.alias === taskAlias,
    ),
  );

  const fetchTask = useStoreActions((actions) => actions.taskSubmission.fetchTask);

  React.useEffect(() => {
    if (taskAlias !== undefined) {
      fetchTask(taskAlias);
    }
  }, [taskAlias, fetchTask]);

  if (task === undefined || taskAlias === undefined) {
    return <></>;
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
          <p className="h5">
            <b>
              {t('taskPage.description.inputFormat')}
            </b>
          </p>
          <blockquote>{inputFormat}</blockquote>
          <p className="h5">
            <b>
              {t('taskPage.description.outputFormat')}
            </b>
          </p>
          <blockquote>{outputFormat}</blockquote>
          <p className="h5">
            <b>
              {t('taskPage.examples')}
            </b>
          </p>

          {task.examples === undefined ? null
            : (
              <CustomTable
                headers={['input', 'output']}
                padding={10}
                rows={task.examples.map(
                  ({
                    input,
                    output,
                  }: { input: string, output: string }) => ([input,
                    output].map(renderHtmlWithNewlines)),
                )}
              />
            )}
        </Col>
        <Col md="4">
          <p className="h5 center">
            Limits
          </p>
          <CustomTable
            headers={['cpuTime', 'realtime', 'memory']}
            rows={[[task.limits?.cpuTime === undefined ? '' : task.limits.cpuTime.toString(),
              task.limits?.wallTime === undefined ? '' : task.limits.wallTime.toString(),
              task.limits?.memory === undefined ? '' : task.limits.memory.toString()]]}
          />

          <CustomTable headers={['input', 'output']} rows={[['input.txt', 'output.txt']]} />
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
