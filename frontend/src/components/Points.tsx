import * as React from 'react';

const Points = (props: { points: string }) => {
    if (props.points === '-'){
        return (
            <p className='gray_color' style={{ padding: 0, margin: 0}}>-</p>
        )
    }
    
    const points = parseInt(props.points);
    const started = points >= 0;
    const correct = points === 100

    const color = started ? (points === 100 ? 'green' : (points === 0 ? 'red' : 'yellow')) : null;

    return (
        <p className={color === null ? "" : `${color}_color`} style={{ padding: 0, margin: 0, fontWeight: (correct ? 'bold' : 'normal') }}>
            {started ? points.toString() : null}
        </p>
    )
}

export default Points;