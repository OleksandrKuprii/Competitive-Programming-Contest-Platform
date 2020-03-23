import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RatingHistogram, { Rating } from './RatingHistogram';
import Difficulty from './Difficulty';
import MyResult from './MyResult';
import { Link } from 'react-router-dom';


export interface Task {
    alias: string
    taskName: string
    category: string
    difficulty: number
    rating: Rating
    myresult: number
    description: { main: string, input_format: string, output_format: string },
    examples: { input: string, output: string }[],
    limits: { cpu_time: number, wall_time: number, memory: number }
}

function TaskList(props: { tasks: Task[] }) {
    const { t } = useTranslation();

    return (
        <Table striped hover variant="dark" size='sm' borderless>
            <thead className="tasklist">
                <tr>
                    {[t('tasklist.header.name'),
                    t('tasklist.header.category'),
                    t('tasklist.header.difficulty'),
                    t('tasklist.header.rating'),
                    t('tasklist.header.myresult')].map((header, i) => (
                        <th style={{ fontSize: 18 }} key={`tasklist-header-${i}`}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.tasks.map((task, i) =>
                    <tr key={`tasklist-item-${i}`}>
                        <td>
                            <Link to={`/task/view/${task.alias}`} style={{color: 'white'}}>{task.taskName}</Link>
                        </td>
                        <td>{task.category}</td>
                        <td>
                            <Difficulty difficulty={task.difficulty} unique_key={`tasklist-difficulty-${i}`}></Difficulty>
                        </td>
                        <td>
                            <RatingHistogram rating={task.rating} unique_key={`tasklist-item-rating-${i}`}></RatingHistogram>
                        </td>
                        <td>
                            <MyResult points={task.myresult}></MyResult>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

export default TaskList;