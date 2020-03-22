import * as React from 'react';

const MyResult = (props: { points: number }) => {
    const points = props.points;
    const started = points >= 0;
    const correct = points === 100

    const color = started ? (points === 100 ? 'green' : (points === 0 ? 'red' : 'yellow')) : null;

    return (
        <p className={color === null ? "" : `${color}_color`} style={{ padding: 0, margin: 0, fontWeight: (correct ? 'bold' : 'normal') }}>
            {started ? points.toString() : null}
        </p>
    )
}

export default MyResult;