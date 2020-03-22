import * as React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RatingHistogram, { Rating } from './RatingHistogram';
import Difficulty from './Difficulty';
import MyResult from './MyResult';


export interface Task {
    taskName: string
    category: string
    difficulty: number
    rating: Rating
    myresult: number
}

function TaskList(props: { tasks: Task[] }) {
    const { t } = useTranslation();

    return (
        <Table striped bordered hover variant="dark" size='sm' borderless>
            <thead>
                <tr>
                    {[t('tasklist.header.name'),
                    t('tasklist.header.category'),
                    t('tasklist.header.difficulty'),
                    t('tasklist.header.rating'),
                    t('tasklist.header.myresult')].map((header) => (
                        <th style={{ fontSize: 18 }}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.tasks.map((task, i) =>
                    <tr key={i}>
                        <td>{task.taskName}</td>
                        <td>{task.category}</td>
                        <td>
                            <Difficulty difficulty={task.difficulty}></Difficulty>
                        </td>
                        <td>
                            <RatingHistogram rating={task.rating}></RatingHistogram>
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