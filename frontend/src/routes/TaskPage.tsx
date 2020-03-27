import { useStoreActions, useStoreState } from 'easy-peasy';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Parser as HtmlToReactParser } from 'html-to-react';
import CustomTable from '../components/CustomTable';
import { GreatestResult } from '../components/Result';
import SolutionDropZone from '../components/SolutionDropZone';
import { Task } from '../models/taskModel';

const TaskPage = () => {
  const { t } = useTranslation();

  const { taskAlias } = useParams();

  const task: Task = useStoreState(
    (state) => state.task.list.find(
      (_task: Task) => _task.alias === taskAlias,
    ),
  );

  // const submitSubmission = useStoreActions((actions: any) =>
  //  actions.submission.submitSubmission);
  const fetchTask = useStoreActions((actions: any) => actions.task.fetchTask);

  React.useEffect(() => {
    fetchTask(taskAlias);
  }, [taskAlias, fetchTask]);

  if (task === undefined) {
    return <></>;
  }

  const htmlToReactParser = new HtmlToReactParser();

  const {
    main: mainOriginal,
    inputFormat: inputFormatOriginal,
    outputFormat: outputFormatOriginal,
  } = task.description;

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
            {t('taskpage.personalResult')}
            {': '}
            <GreatestResult taskAlias={taskAlias} />
            {' '}
          </p>
          <blockquote>{main}</blockquote>
          <p className="h5">
            <b>
              {t('taskpage.description.inputformat')}
            </b>
          </p>
          <blockquote>{inputFormat}</blockquote>
          <p className="h5">
            <b>
              {t('taskpage.description.outputformat')}
            </b>
          </p>
          <blockquote>{outputFormat}</blockquote>
          <p className="h5">
            <b>
              {t('taskpage.examples')}
            </b>
          </p>

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
        </Col>
        <Col md="4">
          <p className="h5 center">
            Limits
          </p>
          <CustomTable
            headers={['cputime', 'realtime', 'memory']}
            rows={[[task.limits.cpuTime === undefined ? '' : task.limits.cpuTime.toString(),
              task.limits.wallTime === undefined ? '' : task.limits.wallTime.toString(),
              task.limits.memory === undefined ? '' : task.limits.memory.toString()]]}
          />

          <CustomTable headers={['input', 'output']} rows={[['input.txt', 'output.txt']]} />
        </Col>
      </Row>

      <Row>
        <Col>
          <p><b>{t('taskpage.submitsolution')}</b></p>

          {taskAlias === undefined ? null : <SolutionDropZone />}
        </Col>
      </Row>
    </>
  );
};

export default TaskPage;
