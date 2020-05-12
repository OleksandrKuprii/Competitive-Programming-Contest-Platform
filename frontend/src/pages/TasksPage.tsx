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
import DataFilter from '@/providers/dataFilter';
import DataSort from '@/providers/dataSort';
import LoadingPage from '~/pages/LoadingPage';
import { useStoreState, useStoreActions } from '~/hooks/store';
import { SortBy } from '~/typings/models';

const TasksPage: FC = () => {
  const { t } = useTranslation();

  const {
    selectedCategories: selectedCategoriesAction,
    selectedResults,
    selectedDifficultyRange,
    selectedSortBy,
  } = useStoreActions((actions) => ({
    ...actions.filterAndSort,
  }));

  const tasksLoading = useStoreState((state) => state.task.loadingStatus);
  const difficultyRange = useStoreState(
    (state) => state.filterAndSort.difficultyRange,
  );
  const selectedCategories = useStoreState(
    (state) => state.filterAndSort.categories,
  );
  const results = useStoreState((state) => state.filterAndSort.results);
  const sortBy = useStoreState((state) => state.filterAndSort.sortBy);
  const order = useStoreState((state) => state.filterAndSort.order);

  const tasks = useStoreState((state) => state.task.tasks);
  const categories = useStoreState((state) => state.task.categories);

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
                        selectedCategoriesAction([]);
                        return;
                      }

                      const ids = selected.map((s: any) => s.value);

                      selectedCategoriesAction(ids);
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
                    onFinalChange={selectedDifficultyRange}
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
                      active={results}
                      onChange={selectedResults}
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
                  onChange={(o) => {
                    if (o === 0) {
                      selectedSortBy({ sortBy: SortBy.publishedAt, order: -1 });
                      return;
                    }

                    selectedSortBy({ sortBy: SortBy.difficulty, order: o });
                  }}
                  active={sortBy === 'difficulty' ? order : 0}
                />{' '}
              </th>
              <th>{t('headers.rating')}</th>
              <th>{t('headers.result')}</th>
            </tr>
          </thead>
          <tbody>
            <DataFilter
              tests={[
                ({ difficulty }) =>
                  difficulty !== undefined &&
                  difficulty >= difficultyRange[0] &&
                  difficulty <= difficultyRange[1],
                ({ categoryId }) =>
                  selectedCategories.length === 0 ||
                  (categoryId !== undefined &&
                    selectedCategories.includes(categoryId)),
                ({ points }) => {
                  if (results.length === 0) {
                    return true;
                  }

                  if (points === undefined || points === null) {
                    return results.includes('notStarted');
                  }

                  if (points === 0) {
                    return results.includes('zero');
                  }

                  if (points === 100) {
                    return results.includes('correct');
                  }

                  return results.includes('partial');
                },
              ]}
              items={tasks}
            >
              {(filtered) => (
                <>
                  <DataSort
                    items={filtered}
                    value={(task) => (task as { [key: string]: any })[sortBy]}
                    order={order}
                  >
                    {(sortedAndFiltered) =>
                      sortedAndFiltered.map(
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
                                      selectedCategoriesAction([
                                        definedCategory,
                                      ]);
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
                      )
                    }
                  </DataSort>
                </>
              )}
            </DataFilter>
          </tbody>
        </Table>
      </WithFilterBar>
    </WithLoading>
  );
};

export default TasksPage;
