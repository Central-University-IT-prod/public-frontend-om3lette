import * as rangeCalculator from '@/scripts/getRange'
const range = {
  'daily': [],
  'weekly': [],
  'monthly': []
}
const fiveStarsSystem = 5
const threeStarsSystem = 3

export function validateActions(habitsData, currentDate, getAllData = false) {
  const outputData = []
  let overallMark = 0
  const startDate = new Date(Math.min(...habitsData.map(o => new Date(o.date.start).getTime())))
  range.daily = rangeCalculator.getDayRanges(startDate, currentDate)
  range.weekly = rangeCalculator.getWeekRanges(startDate, currentDate)
  range.monthly = rangeCalculator.getMonthRanges(startDate, currentDate)
  habitsData.forEach((habitData) => {
    const rangeData = range[habitData.period]
    let periodStartIndex = getIndexOfDate(new Date(habitData.date.start), rangeData, 0)
    const isSingleCompletionType = !habitData.targetValue ? true : false
    let successPeriodCounter = 0
    let progress = []
    let taskCompletion = []
    let actionPeriodIndex = periodStartIndex
    habitData.actions
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((action) => {
        const actionDate = new Date(action.date)
        actionPeriodIndex = getIndexOfDate(actionDate, rangeData, actionPeriodIndex) - periodStartIndex
        for (let k = progress.length; k < actionPeriodIndex + 1; k++) {
          progress.push(0)
          taskCompletion.push(false)
        }
        if (isSingleCompletionType) {
          progress[actionPeriodIndex]++
          taskCompletion[actionPeriodIndex] = true
        } else {
          progress[actionPeriodIndex] += action.value
          taskCompletion[actionPeriodIndex] = progress[actionPeriodIndex] >= habitData.targetValue
        }
      })
    const expectedLength = rangeData.length - periodStartIndex
    while (progress.length !== expectedLength) {
      progress.push(0)
      taskCompletion.push(false)
    }
    taskCompletion.forEach((state) => {
      if (state) successPeriodCounter++
    })
    const mark = Math.round((successPeriodCounter / expectedLength) * fiveStarsSystem)
    overallMark += mark
    outputData.push({
      id: habitData.id,
      category: habitData.category,
      title: habitData.title,
      progress,
      taskCompletion,
      mark: String(mark),
      date: habitData.date
    })
  })
  const inProgressArray = []
  const finishedArray = []
  outputData.forEach((habit) => {
    const endDate = new Date(habit.date.end)
    if (!habit.date.end || endDate > currentDate) {
      inProgressArray.push(habit)
      return
    }
    finishedArray.push(habit)
  })
  if (!getAllData)
    return [inProgressArray, finishedArray, Math.round(((overallMark * threeStarsSystem) / fiveStarsSystem) / outputData.length)]
  return outputData
}

function getIndexOfDate(dataToFind, rangeData, periodStartIndex = 0) {
  while (
    !rangeCalculator.isInRange(dataToFind, rangeData[periodStartIndex][0], rangeData[periodStartIndex][1]) &&
    periodStartIndex < rangeData.length - 1
  ) {
    periodStartIndex++
  }
  return periodStartIndex
}
