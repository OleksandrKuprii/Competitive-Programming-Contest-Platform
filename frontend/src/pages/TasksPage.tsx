import * as React from 'react';
import { Col } from 'react-bootstrap';
import { FC } from 'react';
import Loading from '../components/atoms/loading';
import TaskList from '../components/organisms/taskList';
import WithFilterBar from '../components/templates/withFilterBar';
import WithLoading from '../components/templates/withLoading';
import { Category, Task } from '../models/interfaces';
import IntRangeFilter from '../components/molecules/intRangeFilter';
import PillSelect from '../components/molecules/pillSelect';

interface TasksPageProps {
  tasks: Task[];
  categories: Category[];
  tasksLoading: boolean;
  selectedCategories: Set<string>;
  toggleCategory: (category: string) => any;
}

const TasksPage: FC<TasksPageProps> = ({
  tasks,
  tasksLoading,
  categories,
  selectedCategories,
  toggleCategory,
}) => {
  const preparedTasks =
    selectedCategories.size === 0
      ? tasks
      : [...tasks].filter(
          ({ categoryId }) =>
            categoryId !== undefined && selectedCategories.has(categoryId),
        );

  return (
    <WithLoading
      loading={tasksLoading}
      loadingNode={<Loading variant="loading" />}
    >
      <WithFilterBar
        filters={
          <>
            <Col className="p-0">
              <PillSelect
                options={categories.map((category) => ({
                  id: category.id,
                  name: category.name,
                }))}
                active={selectedCategories}
                onToggle={toggleCategory}
              />
            </Col>
            <Col className="p-0">
              <IntRangeFilter
                header="difficulty"
                from={1}
                to={10}
                initialValues={[1, 10]}
                onFinalChange={() => {}}
              />
            </Col>
          </>
        }
      >
        <TaskList tasks={preparedTasks} onCategoryClick={() => {}} />
      </WithFilterBar>
    </WithLoading>
  );
};

export default TasksPage;
