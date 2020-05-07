import * as React from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Defined from '../../atoms/defined';
import Result from '../../atoms/result';
import Difficulty from '../../atoms/difficulty';
import BlockLink from '../../atoms/blockLink';
import { Task } from '../../../models/interfaces';
import StyledTable from '../../atoms/styledTable';
import SmallRatingChart from '../../molecules/smallRatingChart';

interface TaskListProps {
  tasks: Task[];
  onCategoryClick: (category: string) => any;
}

const TaskList: FC<TaskListProps> = ({ tasks, onCategoryClick }) => {
  const { t } = useTranslation();

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>{t('headers.name')}</th>
          <th>{t('headers.category')}</th>
          <th>{t('headers.difficulty')}</th>
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
                <BlockLink onClick={`/task/view/${id}`}>{name}</BlockLink>
              </td>
              <td>
                <Defined value={categoryId}>
                  {(definedCategory) => (
                    <BlockLink
                      onClick={() => {
                        onCategoryClick(definedCategory);
                      }}
                    >
                      {categoryName}
                    </BlockLink>
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
                    <SmallRatingChart id={id} rating={definedRating} />
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
                            <BlockLink
                              onClick={`/submission/view/${definedSubmissionId}`}
                            >
                              <Result
                                status={definedStatus}
                                points={definedPoints}
                              />
                            </BlockLink>
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
    </StyledTable>
  );
};

export default TaskList;
