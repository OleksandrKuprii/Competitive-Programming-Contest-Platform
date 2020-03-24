import * as React from 'react';


export const StatusColor = ({ points, status }: { points: number , status: string[] }) => {
    let colour = 'green'
    if (status[0] != 'Ok'){ colour = 'yellow'}
    if (points === 0){colour = 'red'}
    colour += '_color'
    return (
       <div className = {colour}  >
           {status.join(' ')}
        </div>           
)
}

