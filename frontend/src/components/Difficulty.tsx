import * as React from 'react';

import { FaStar, FaStarHalf } from 'react-icons/fa';

const Difficulty = (props: { difficulty: number, unique_key: string }) => {
    const halfStar = props.difficulty % 2 === 1

    const stars = Math.trunc(props.difficulty / 2)

    return (
        <>
            {Array(stars).fill(0).map((_, i) => (
                <FaStar color="#ffbb43" key={`${props.unique_key}-${i}`}></FaStar>
            ))}

            {halfStar ? <FaStarHalf color="#ffbb43"></FaStarHalf> : <></> }
        </>
    )
}

export default Difficulty;