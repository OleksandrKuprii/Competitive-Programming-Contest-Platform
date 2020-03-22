import * as React from 'react';

import { FaStar, FaStarHalf } from 'react-icons/fa';

const Difficulty = (props: { difficulty: number }) => {
    const halfStar = props.difficulty % 2 === 1

    const stars = Math.trunc(props.difficulty / 2)

    return (
        <>
            {Array(stars).fill(0).map(() => (
                <FaStar color="#f3b800"></FaStar>
            ))}

            {halfStar ? <FaStarHalf color="#f3b800"></FaStarHalf> : <></> }
        </>
    )
}

export default Difficulty;