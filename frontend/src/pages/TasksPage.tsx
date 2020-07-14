import * as React from 'react';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Table from '@/molecules/table';
import Defined from '@/helpers/defined';
import Difficulty from '@/atoms/difficulty';
import SmallRatingChart from '@/molecules/smallRatingChart';
import WithLoading from '@/templates/withLoading';
import Result from '@/atoms/result';
import Link from '@/atoms/link';
import SortControl from '@/atoms/sortControl';
import DataFilter from '@/providers/dataFilter';
import DataSort from '@/providers/dataSort';
import Page from '@/templates/page';
import LoadingPage from '~/pages/fallback/LoadingPage';
import {useStoreActions, useStoreState} from '~/hooks/store';
import {Result as ResultEnum, SortBy} from '~/typings/models';

const TasksPage: FC = () => {
  const {t} = useTranslation();

  const {
    selectedCategories: selectedCategoriesAction,
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

  return (
    <Page>
      <WithLoading loading={tasksLoading} loadingNode={<LoadingPage/>}>
        <Table>
          <thead>
          <tr>
            <th>{t('headers.name')}</th>
            <th>{t('headers.category')}</th>
            <th style={{display: 'flex', verticalAlign: 'center'}}>
              {t('headers.difficulty')}
              <SortControl
                onChange={(o) => {
                  if (o === 0) {
                    selectedSortBy({sortBy: SortBy.publishedAt, order: -1});
                    return;
                  }

                  selectedSortBy({sortBy: SortBy.difficulty, order: o});
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
              ({difficulty}) =>
                difficulty !== undefined &&
                difficulty >= Math.min(...difficultyRange) &&
                difficulty <= Math.max(...difficultyRange),
              ({categoryId}) =>
                selectedCategories.length === 0 ||
                (categoryId !== undefined &&
                  selectedCategories.includes(categoryId)),
              ({points}) => {
                if (results.length === 0) {
                  return true;
                }

                if (points === undefined || points === null) {
                  return results.includes(ResultEnum.NotStarted);
                }

                if (points === 0) {
                  return results.includes(ResultEnum.Zero);
                }

                if (points === 100) {
                  return results.includes(ResultEnum.Correct);
                }

                return results.includes(ResultEnum.Partial);
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
                          <td style={{maxWidth: 200, overflow: 'hidden'}}>
                            <Link href={`#/task/view/${id}`}>{name}</Link>
                          </td>
                          <td>
                            <Defined value={categoryId}>
                              {(definedCategory) => (
                                // <LinkButton
                                //   onClick={() => {
                                //     selectedCategoriesAction([
                                //       definedCategory,
                                //     ]);
                                //   }}
                                // >
                                //   {categoryName}
                                // </LinkButton>
                                <></>
                              )}
                            </Defined>
                          </td>
                          <td>
                            <Defined value={difficulty}>
                              {(definedDifficulty) => (
                                <Difficulty difficulty={definedDifficulty}/>
                              )}
                            </Defined>
                          </td>
                          <td>
                            <Defined value={rating}>
                              {(definedRating) => (
                                <SmallRatingChart rating={definedRating}/>
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
      </WithLoading>
    </Page>
  );
};

export default TasksPage;
