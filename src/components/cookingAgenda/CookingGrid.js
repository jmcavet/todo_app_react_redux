import React from 'react'
import MealContainer from './MealContainer'
import { getDay, getNextDay } from '../../helper/date'

const CookingGrid = () => {
    const myMeals = [
        { date: getDay(new Date()) },
        { date: getDay(getNextDay(1)) },
        { date: getDay(getNextDay(2)) },
        { date: getDay(getNextDay(3)) },
        { date: getDay(getNextDay(4)) },
        { date: getDay(getNextDay(5)) },
        { date: getDay(getNextDay(6)) },
    ]

    return (
        <div>
            {myMeals?.map((meal, index) => <MealContainer key={index} meal={meal} />)}
        </div>
    )
}

export default CookingGrid