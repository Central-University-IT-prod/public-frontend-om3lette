export function periodToReadable(period) {
  switch (period) {
    case 'weekly':
      return 'Еженедельно'
    case 'monthly':
      return 'Ежемесячно'
    case 'daily':
      return 'Ежедневно'
    default:
      return ''
  }
}

export function periodToReadableInfPlural(period) {
  switch (period) {
    case 'weekly':
      return 'Недели'
    case 'monthly':
      return 'Месяцы'
    case 'daily':
      return 'Дни'
    default:
      return ''
  }
}

export function dateToReadable(dateStr) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  return `${day}.${month}.${year}`
}

export function renderDate(habitData) {
  const startDate = dateToReadable(habitData.date.start)
  const endDate = dateToReadable(habitData.date.end)
  if (startDate !== '' && endDate !== '') {
    return `С ${startDate} по ${endDate}`
  }
  if (endDate === '' && startDate !== '') {
    return `С ${startDate}`
  }
  return ''
}
