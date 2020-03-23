import * as React from 'react';

const StatusColor = (props: { points: string, status:string }) => {
    if (props.points === '-'){
        return (
        <p className='gray_color' style={{ padding: 0, margin: 0}}>{props.status}</p>
        )
    }
    
    const points = parseInt(props.points);
    const started = points >= 0;
    const correct = points === 100
    const status = props.status
    
    
    let color = started ? (points === 100 ? 'green' : (points === 0 ? 'red' : 'yellow')) : null;


    return (
        <p className={color === null ? "" : `${color}_color`} style={{ padding: 0, margin: 0, fontWeight: (correct ? 'bold' : 'normal') }}>
            {status}
        </p>
    )
}

export default StatusColor;