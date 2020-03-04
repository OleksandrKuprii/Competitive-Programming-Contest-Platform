import * as React from 'react';
import { Table } from 'react-bootstrap';

export interface Task {
    taskName: string
    category: string
    difficulity: string
    status: string
}

function TaskList(props: { tasks: Task[] }) {
    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Difficulity</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {props.tasks.map((task, i) =>
                    <tr>
                        <td>{task.taskName}</td>
                        <td>{task.category}</td>
                        <td>{task.difficulity}</td>
                        <td>{task.status}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

export default TaskList;