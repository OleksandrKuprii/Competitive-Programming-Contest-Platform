import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


export interface Rating {
    correct_percent: number,
    incorrect_percent: number,
    zero_points_percent: number
}

const RatingHistogram = (props: { rating: Rating }) => (
    <div style={{ height: 25, padding: 3 }}>
        {[{ value: props.rating.correct_percent, color: 'green', tooltip_info: '100 points' },
        { value: props.rating.incorrect_percent, color: 'yellow', tooltip_info: '0 < x < 100 points' },
        { value: props.rating.zero_points_percent, color: 'red', tooltip_info: '0 points' }].map((({ value, color, tooltip_info }, i) => (
            <OverlayTrigger
                placement='bottom'
                overlay={
                    <Tooltip id={`tooltip-${i}-${color}`}>
                        {tooltip_info} | {value}%
                        </Tooltip>
                }
            >
                <div className={`${color}_background`} style={{ height: '100%', width: `${value}%`, display: 'inline-block' }}>

                </div>
            </OverlayTrigger>

        )))}
    </div>
)

export default RatingHistogram;