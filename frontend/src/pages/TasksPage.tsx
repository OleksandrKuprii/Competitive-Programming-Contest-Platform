import * as React from 'react';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Difficulty from '@/atoms/difficulty';
import SmallRatingChart from '@/molecules/smallRatingChart';
import WithLoading from '@/templates/withLoading';
import Result from '@/atoms/result';
import SortControl from '@/toucanui/atoms/sortControl';
import DataFilter from '@/providers/dataFilter';
import DataSort from '@/providers/dataSort';
import Page from '@/toucanui/templates/page';
import LoadingPage from '~/pages/fallback/LoadingPage';
import {useStoreActions, useStoreState} from '~/hooks/store';
import {Result as ResultEnum, SortBy} from '~/typings/models';
import {Link} from "react-router-dom";
import LinkButton from "@/toucanui/atoms/linkButton";
import { Table, TableCol } from '@/toucanui/molecules/table';
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";

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
        <Table cols={5}>
          <TableCol header>{t('headers.name')}</TableCol>
          <TableCol header>{t('headers.category')}</TableCol>
          <TableCol header>
            {t('headers.difficulty')}

            <Spacer left={Padding.Normal} />

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
          </TableCol>
          <TableCol header>{t('headers.rating')}</TableCol>
          <TableCol header>{t('headers.result')}</TableCol>
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
                        <React.Fragment key={id}>
                          <TableCol>
                            <Link to={`/task/view/${id}`}>{name}</Link>
                          </TableCol>
                          <TableCol>
                            {(categoryId && categoryName) && <LinkButton
                              onClick={() => {
                                selectedCategoriesAction([
                                  categoryId,
                                ]);
                              }}
                            >
                              {categoryName}
                            </LinkButton>}
                          </TableCol>
                          <TableCol>
                            {difficulty && <Difficulty difficulty={difficulty}/>}
                          </TableCol>
                          <TableCol>
                            {rating && <SmallRatingChart rating={rating}/>}
                          </TableCol>
                          <TableCol>
                            {(submissionId && status && points !== undefined) &&
                            <Link
                              to={`/submission/view/${submissionId}`}
                            >
                              <Result
                                status={status}
                                points={points}
                              />
                            </Link>
                            }
                          </TableCol>
                        </React.Fragment>
                      ),
                    )
                  }
                </DataSort>
              </>
            )}
          </DataFilter>
        </Table>
      </WithLoading>
    </Page>
  );
};

export default TasksPage;
