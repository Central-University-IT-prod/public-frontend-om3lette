import { ref, reactive } from 'vue'

class StorageHandler {
  constructor() {
    this.habitData = this.loadData();
    this.takenIds = Object.keys(this.habitData).map((key) => parseInt(key))
  }

  get newIndex() {
    let index = this.takenIds[this.takenIds.length - 1] + 1
    index = isNaN(index) ? 0 : index
    this.takenIds.push(index)
    return index
  }

  updateMoneyValue(newValue) {
    localStorage.setItem('money', newValue)
  }

  getMoney() {
    const value = parseInt(localStorage.getItem('money'))
    if (!isNaN(value)) return value
    return 0
  }

  updateBoughtCards(newValue) {
    localStorage.setItem('boughtCards', newValue)
  }

  getCards() {
    const value = localStorage.getItem('boughtCards')
    if (!value) return [1, 6, 4]
    return value.split(',').map(Number)
  }

  loadData() {
    const data = localStorage.getItem("habit-data") ?? null;
    if (!data) return {};
    return JSON.parse(data)
  }

  saveData({ existingIndex, newData, saveCurrent = false, addIdAsField = false } = {}) {
    const index = existingIndex ?? this.newIndex
    if (!saveCurrent) {
      if (addIdAsField) newData.id = index
      // create deep copy
      this.habitData[index] = { ...newData };
    }
    localStorage.setItem("habit-data", JSON.stringify(this.habitData))
    if (saveCurrent) return
    return index;
  }

  getData() {
    return ref(this.habitData);
  }

  getHabitById(id) {
    return reactive(this.habitData[id])
  }

  deleteHabitById(id) {
    delete this.habitData[id]
    this.saveData({ saveCurrent: true })
  }
}

export const storageHandler = new StorageHandler();
