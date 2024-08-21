import downloadData from "@/scripts/downloadData"

export function getConfig(habitData, id, currentDate, router, deleteCallback) {
  const items = [
    { icon: 'pi pi-chart-bar', label: 'Визуализация', command: () => visualize() },
    { icon: 'pi pi-download', label: 'Скачать данные', command: () => downloadFile() },
    { icon: 'pi pi-stop-circle', label: 'Завершить', command: () => stopTracking() },
    { icon: 'pi pi-trash', label: 'Удалить', command: () => deleteCallback(id) }
  ]

  function stopTracking() {
    habitData.date.end = currentDate
  }

  function visualize() {
    router.push(`/visualize/?id=${id}`)
  }

  function downloadFile() {
    const fileName = `habit-${id}.json`
    const outputFormat = {
      habits: [
        {
          id,
          title: habitData.title,
          category: habitData.category,
          addDate: habitData.date.start,
          period: habitData.period,
        }
      ],
      actions: []
    }

    habitData.actions.forEach((action, i) => {
      outputFormat.actions.push(action)
      outputFormat.actions[i].id = id
    })
    if (habitData.targetValue)
      outputFormat.habits[0].targetValue = habitData.targetValue

    downloadData(outputFormat, fileName)
  }
  return items
}