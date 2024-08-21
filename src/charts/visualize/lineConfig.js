import { periodToReadableInfPlural } from "@/scripts/valueToReadable";

export function calculateData(progressData, habitPeriod) {
  const readablePeriod = periodToReadableInfPlural(habitPeriod)
  function splitArray(targetSplits = 5) {
    const arrLength = progressData.length;
    if (arrLength < targetSplits) {
      if (arrLength >= 2) {
        targetSplits = 2;
      } else {
        return [progressData];
      }
    }
    const splitSize = Math.ceil(arrLength / targetSplits);
    const result = [];
    const labels = []

    for (let i = 0; i < arrLength; i += splitSize) {
      labels.push(`${readablePeriod} ${i + 1}-${i + 1 + splitSize}`)
      result.push(progressData.slice(i, i + splitSize));
    }

    return [result, labels];
  }

  const [splitArrays, labels] = splitArray();
  const valueContributed = []

  splitArrays.forEach((array, i) => {
    valueContributed.push(0)
    array.forEach((progressValue) => {
      valueContributed[i] += parseInt(progressValue)
    })
  })

  return {
    labels: labels,
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: valueContributed
      }
    ]
  }

}

export const options = {
  responsive: false,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  }
}
