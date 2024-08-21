export function calculateData(taskCompletion) {
  let successCount = 0
  taskCompletion.forEach((state => {
    if (state) successCount++
  }))
  return {
    labels: ['Задача выполнена', 'Задача провалена'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651'],
        data: [successCount, taskCompletion.length - successCount]
      }
    ]
  }
}

export const options = {
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}
