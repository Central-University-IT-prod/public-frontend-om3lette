function getRanges(startDate, endDate, intervalDays) {
  const ranges = []
  let currentDate = new Date(startDate)
  if (intervalDays == 30) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  } else if (intervalDays == 6) {
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 1 ? -6 : 1))
  }
  currentDate.setHours(0, 0, 0, 0);
  while (ranges.length === 0 || ranges[ranges.length - 1][1] <= endDate) {
    const start = new Date(currentDate)
    let end = new Date(currentDate)
    if (intervalDays !== 30) {
      end.setDate(currentDate.getDate() + intervalDays)
    } else {
      end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    }

    end.setHours(23, 59, 59, 999)
    ranges.push([start, end])
    if (intervalDays !== 30) {
      currentDate.setDate(currentDate.getDate() + intervalDays + 1)
    } else {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    }

  }
  return ranges
}

export function getWeekRanges(startDate, endDate) {
  return getRanges(startDate, endDate, 6)
}

export function getMonthRanges(startDate, endDate) {
  return getRanges(startDate, endDate, 30)
}

export function getDayRanges(startDate, endDate) {
  return getRanges(startDate, endDate, 0)
}

export function isInRange(date, startDate, endDate) {
  return date.getTime() <= endDate.getTime() && date.getTime() >= startDate.getTime()
}