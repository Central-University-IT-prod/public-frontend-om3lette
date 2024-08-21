export function calculateData(inProgress, finished) {
  return {
    labels: ['Поддерживаемые', 'Завершенные'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651'],
        data: [inProgress, finished]
      }
    ]
  }

}

export const options = {
  responsive: false,
  maintainAspectRatio: true
}
