import * as React from 'react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTrackBackground, Range } from 'react-range';
import { Col, Grid, Row } from '@/atoms/grid';
import Table from '@/molecules/table';
import Defined from '@/helpers/defined';
import Difficulty from '@/atoms/difficulty';
import SmallRatingChart from '@/molecules/smallRatingChart';
import WithLoading from '@/templates/withLoading';
import Result from '@/atoms/result';
import WithFilterBar from '@/templates/withFilterBar';
import PillSelect from '@/molecules/pillSelect';
import Link from '@/atoms/link';
import LinkButton from '@/atoms/button/LinkButton';
import StyledSelect from '@/atoms/styledSelect';
import { HorizontalSpacer, Spacer } from '@/atoms/spacers';
import SortControl from '@/atoms/sortControl';
import { Category, Task } from '~/models/interfaces';
import LoadingPage from '~/pages/LoadingPage';

interface TasksPageProps {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => any;

  difficultyRange: number[];
  setDifficultyRange: (range: number[]) => any;

  selectedResults: string[];
  setSelectedResults: (results: string[]) => any;

  tasks: Task[];
  tasksLoading: boolean;

  sortBy: { id: string; order: number };
  setSortBy: (sortBy: { id: string; order: number }) => any;
}

const TasksPage: FC<TasksPageProps> = ({
  tasks: rawTasks,
  tasksLoading,
  categories,
  selectedCategories,
  setSelectedCategories,
  selectedResults,
  setSelectedResults,
  difficultyRange,
  setDifficultyRange,
  sortBy,
  setSortBy,
}) => {
  const { t } = useTranslation();

  const resultFilter: ((points: number | undefined) => any)[] = [];

  if (selectedResults.length !== 0) {
    if (!selectedResults.includes('notStarted')) {
      resultFilter.push((points) => points !== undefined && points !== null);
    }

    if (!selectedResults.includes('zero')) {
      resultFilter.push((points) => points !== 0);
    }

    if (!selectedResults.includes('partial')) {
      resultFilter.push(
        (points) =>
          points === undefined ||
          points === null ||
          !(points > 1 && points < 100),
      );
    }

    if (!selectedResults.includes('correct')) {
      resultFilter.push((points) => points !== 100);
    }
  }

  const tasks = (selectedCategories.length === 0
    ? rawTasks
    : [...rawTasks].filter(({ categoryId }) => {
        return (
          categoryId !== undefined && selectedCategories.includes(categoryId)
        );
      })
  )
    .filter(
      ({ difficulty }) =>
        difficulty === undefined ||
        (difficultyRange[0] <= difficulty && difficultyRange[1] >= difficulty),
    )
    .filter(({ points }) => resultFilter.every((f) => f(points)));

  tasks.sort((a: any, b: any) => {
    const { id, order } = sortBy;

    const aValue = a[id] as any;
    const bValue = b[id] as any;

    if (aValue === bValue && aValue === undefined) {
      return 0;
    }

    if (aValue === undefined) {
      return -order;
    }

    if (bValue === undefined) {
      return order;
    }

    if (aValue > bValue) {
      return order;
    }

    if (bValue > aValue) {
      return -order;
    }

    return 0;
  });

  const [difficultyValues, setDifficultyValues] = useState(difficultyRange);

  return (
    <WithLoading loading={tasksLoading} loadingNode={<LoadingPage />}>
      <WithFilterBar
        filters={
          <>
            <Spacer size={10} />
            <Row>
              <Col size={1}>
                <Grid justifyContent="center">
                  <StyledSelect
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="Category..."
                    value={categories
                      .filter((c) => selectedCategories.includes(c.id))
                      .map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                    options={categories.map((category) => ({
                      label: category.name,
                      value: category.id,
                    }))}
                    onChange={(selected: any) => {
                      if (selected === null) {
                        setSelectedCategories([]);
                        return;
                      }

                      const ids = selected.map((s: any) => s.value);

                      setSelectedCategories(ids);
                    }}
                  />
                </Grid>
              </Col>

              <HorizontalSpacer size={20} />

              <Col size={1}>
                <Grid justifyContent="center">
                  <Range
                    onChange={(v) => {
                      setDifficultyValues(v);
                    }}
                    onFinalChange={setDifficultyRange}
                    min={1}
                    max={10}
                    values={difficultyValues}
                    renderThumb={({ props, index }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '20px',
                          width: '20px',
                          // borderRadius: '2px',
                          backgroundColor: '#333',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0px 1px 3px #000',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-28px',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            fontFamily:
                              'Arial,Helvetica Neue,Helvetica,sans-serif',
                            padding: '4px',
                            // borderRadius: '4px',
                            backgroundColor: '#212121',
                          }}
                        >
                          {
                            [
                              'newbie',
                              'novice',
                              'rookie',
                              'beginner',
                              'intermediate',
                              'skillful',
                              'seasoned',
                              'advanced',
                              'senior',
                              'expert',
                            ][difficultyValues[index] - 1]
                          }
                        </div>
                        <div
                          style={{
                            height: '8px',
                            width: '4px',
                            backgroundColor: '#CCC',
                          }}
                        />
                      </div>
                    )}
                    renderTrack={({ props, children }) => (
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                          ...props.style,
                          height: '24px',
                          display: 'flex',
                          width: '100%',
                        }}
                      >
                        <div
                          ref={props.ref}
                          style={{
                            height: '20px',
                            width: '100%',
                            background: getTrackBackground({
                              values: difficultyValues,
                              colors: ['transparent', '#212121', 'transparent'],
                              min: 1,
                              max: 10,
                            }),
                            alignSelf: 'center',
                            boxShadow: '2px 2px 2px 2px #000',
                            // borderRadius: 5,
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    )}
                  />
                </Grid>
              </Col>

              <HorizontalSpacer size={20} />

              <Col size={1}>
                <Grid justifyContent="center">
                  <Row justifyContent="space-between">
                    <PillSelect
                      options={[
                        { id: 'correct', name: 'Correct' },
                        { id: 'partial', name: 'Partial' },
                        { id: 'zero', name: 'Zero' },
                        { id: 'notStarted', name: 'Not Started' },
                      ]}
                      active={selectedResults}
                      onChange={setSelectedResults}
                    />
                  </Row>
                </Grid>
              </Col>
            </Row>
          </>
        }
      >
        <Table>
          <thead>
            <tr>
              <th>{t('headers.name')}</th>
              <th>{t('headers.category')}</th>
              <th style={{ display: 'flex', verticalAlign: 'center' }}>
                {t('headers.difficulty')}
                <SortControl
                  onChange={(order) => {
                    if (order === 0) {
                      setSortBy({ id: 'publishedAt', order: -1 });
                      return;
                    }

                    setSortBy({ id: 'difficulty', order });
                  }}
                  active={sortBy.id === 'difficulty' ? sortBy.order : 0}
                />{' '}
              </th>
              <th>{t('headers.rating')}</th>
              <th>{t('headers.result')}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(
              ({
                id,
                categoryId,
                categoryName,
                difficulty,
                name,
                points,
                rating,
                status,
                submissionId,
              }) => (
                <tr key={id}>
                  <td style={{ maxWidth: 200, overflow: 'hidden' }}>
                    <Link href={`#/task/view/${id}`}>{name}</Link>
                  </td>
                  <td>
                    <Defined value={categoryId}>
                      {(definedCategory) => (
                        <LinkButton
                          onClick={() => {
                            setSelectedCategories([definedCategory]);
                          }}
                        >
                          {categoryName}
                        </LinkButton>
                      )}
                    </Defined>
                  </td>
                  <td>
                    <Defined value={difficulty}>
                      {(definedDifficulty) => (
                        <Difficulty difficulty={definedDifficulty} />
                      )}
                    </Defined>
                  </td>
                  <td>
                    <Defined value={rating}>
                      {(definedRating) => (
                        <SmallRatingChart rating={definedRating} />
                      )}
                    </Defined>
                  </td>
                  <td>
                    <Defined value={status}>
                      {(definedStatus) => (
                        <Defined value={points}>
                          {(definedPoints) => (
                            <Defined value={submissionId}>
                              {(definedSubmissionId) => (
                                <Link
                                  href={`#/submission/view/${definedSubmissionId}`}
                                >
                                  <Result
                                    status={definedStatus}
                                    points={definedPoints}
                                  />
                                </Link>
                              )}
                            </Defined>
                          )}
                        </Defined>
                      )}
                    </Defined>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </WithFilterBar>
    </WithLoading>
  );
};

export default TasksPage;
