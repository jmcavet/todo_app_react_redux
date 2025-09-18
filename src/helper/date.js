export function getDay(date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const dayOfWeek = date.getDay()

    let dayOfWeekName = ''
    switch (dayOfWeek) {
        case 0:
            dayOfWeekName = "Sunday";
            break
        case 1:
            dayOfWeekName = "Monday";
            break
        case 2:
            dayOfWeekName = "Tuesday";
            break
        case 3:
            dayOfWeekName = "Wednesday";
            break
        case 4:
            dayOfWeekName = "Thursday";
            break
        case 5:
            dayOfWeekName = "Friday";
            break
        case 6:
            dayOfWeekName = "Saturday"
            break
        default:
            dayOfWeekName = 'Default'
    }

    return dayOfWeekName + ' ' + month + '-' + day + '-' + year
}

export function getNextDay(incr) {
    const today = new Date()
    const dayN = new Date(today)
    dayN.setDate(dayN.getDate() + incr)

    return dayN
}

export function getDateNumber(fullDate) {
    return fullDate.trim().split(/\s+/)[1]
}

export function dateToTimestamp(strDate) {
    const dt = new Date(strDate).getTime()
    return parseInt(dt / 1000)
}