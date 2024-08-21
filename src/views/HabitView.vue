<script setup>
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import { reactive, ref, watch } from 'vue'
import { storageHandler } from '@/scripts/StorageHandler'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import HabitDisplay from '@/components/HabitDisplay.vue'
import { periodToReadable, renderDate } from '@/scripts/valueToReadable'
import LoadFromFile from '@/components/LoadFromFile.vue'
import HabitDescription from '@/components/HabitDescription.vue'
import habitsLibrary from '@/json/habitsLibrary.json'
import checkValues from '@/scripts/checkValues'

const periodTypes = [
  { name: 'Ежедневно', value: 'daily' },
  { name: 'Еженедельно', value: 'weekly' },
  { name: 'Ежемесячно', value: 'monthly' }
]
const toast = useToast()
const habitData = reactive({
  title: '',
  category: '',
  date: { start: '', end: '' },
  actions: [],
  period: '',
  targetValue: undefined,
  metrics: ''
})
function changeFormat(data) {
  const ids = []
  data.habits.forEach((habit) => {
    habit.actions = []
    habit.date = { start: habit.addDate }
    ids.push(habit.id)
    delete habit.id
    delete habit.addDate
  })
  data.actions.forEach((action) => {
    const index = ids.indexOf(action.id)
    delete action.id
    data.habits[index].actions.push(action)
  })
  return data.habits
}
const preset = ref(false)
function createHabit() {
  let habit = checkTarget(habitData)
  let missingValue = ''
  if (habit.title === '') {
    missingValue = 'Название'
  } else if (habit.category === '') {
    missingValue = 'Категория'
  } else if (habit.date.start === '') {
    missingValue = 'Дата начала'
  } else if (habit.period === '') {
    missingValue = 'Интервал'
  }
  if (missingValue !== '') {
    toast.add({
      severity: 'warn',
      summary: 'Ошибка',
      detail: `${missingValue} не указан(а)(о)`,
      life: 3000
    })
    return
  }
  storageHandler.saveData({ newData: habit, addIdAsField: true })
  toast.add({
    severity: 'success',
    summary: 'Новая привычка',
    detail: 'Привычка успешно сохранена',
    life: 3000
  })
}

function checkTarget(habit) {
  if ([0, 1].includes(parseInt(habit.target))) {
    delete habit.target
  }
  return habit
}

function onUpload(fileContent) {
  const habits = fileContent.habits
  if (!habits) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка формата ввода',
      detail: `Привычки в файле обнаружены не были`,
      life: 5000
    })
    return
  }
  const fieldsToCheck = ['title', 'category', 'period', 'addDate']
  const missingField = checkValues(habits, fieldsToCheck)
  if (missingField) {
    toast.add({
      severity: 'error',
      summary: 'Битые данные',
      detail: `Привычка не содержит поле '${missingField}'. Сделайте экспорт ещё раз`,
      life: 5000
    })
    return
  }

  const receivedData = changeFormat(fileContent)
  toast.add({
    severity: 'info',
    summary: 'Привычки добавлены',
    detail: `Импортировано ${receivedData.length} привычек`,
    life: 3000
  })
  receivedData.forEach((habit) => {
    habit = checkTarget(habit)
    storageHandler.saveData({ newData: habit, addIdAsField: true })
  })
}

watch(preset, (selectedPresetData) => {
  Object.keys(selectedPresetData).forEach((key) => {
    habitData[key] = selectedPresetData[key]
  })
})
</script>

<template>
  <main class="flex lg:h-screen pt-10 flex-col items-center lg:flex-row">
    <section
      class="w-full lg:w-1/2 flex flex-col items-center max-h-[850px] h-[130vh] lg:h-screen lg:max-h-auto"
    >
      <h3 class="text-center">Создадим новую привычку вместе!</h3>
      <div class="flex flex-col h-full lg:h-[70%] justify-around w-8/12">
        <div class="flex flex-col items-center">
          <label for="preset">Готовые привычки</label>
          <Dropdown
            enabled
            v-model="preset"
            id="preset"
            placeholder="Лучшие привычки"
            class="w-full lg:w-[14rem] h-full"
            :options="habitsLibrary"
            optionLabel="title"
          />
        </div>
        <div class="flex flex-col sm:flex-row justify-around items-center">
          <div class="mb-4 sm:mb-0">
            <label for="title">Название</label>
            <InputText v-model="habitData.title" placeholder="Пить воду" class="h-2/3" id="title" />
          </div>
          <div class="">
            <label for="category">Категория</label>
            <InputText
              v-model="habitData.category"
              placeholder="Здоровье"
              class="h-2/3"
              id="category"
            />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-around items-center">
          <div class="mb-4 sm:mb-0">
            <label for="startDate">Дата начала</label>
            <Calendar
              v-model="habitData.date.start"
              dateFormat="dd-mm-yy"
              showIcon
              iconDisplay="input"
              inputId="startDate"
              class="h-2/3"
            />
          </div>
          <div>
            <label for="endDate">Дата окончания</label>
            <Calendar
              v-model="habitData.date.end"
              dateFormat="dd-mm-yy"
              showIcon
              iconDisplay="input"
              inputId="endDate"
              class="h-2/3"
              placeholder="Необязательно"
            />
          </div>
        </div>
        <div class="flex flex-col items-center">
          <label for="period">Интервал</label>
          <Dropdown
            v-model="habitData.period"
            :options="periodTypes"
            id="period"
            option-label="name"
            option-value="value"
            placeholder="Выберите интервал"
            class="w-full lg:w-[14rem] h-full"
          />
        </div>
        <div class="flex items-center flex-col">
          <label for="target">Цель</label>
          <InputNumber
            v-tooltip.focus.top="'0 или 1, если один раз за интервал'"
            placeholder="Выполнить одноразово"
            v-model="habitData.targetValue"
            inputId="target"
            class="h-2/3"
          />
        </div>
      </div>
      <Button
        class="confirm-button mt-5"
        label="Создать"
        icon="pi pi-check"
        iconPos="right"
        @click="createHabit"
      />
    </section>
    <section class="w-[90%] lg:w-5/12 flex flex-col items-center">
      <HabitDescription :habitData="habitData">
        <HabitDisplay text="Время трекинга" :data="renderDate(habitData)" />
        <HabitDisplay text="Интервал выполнения" :data="periodToReadable(habitData.period)" />
        <HabitDisplay
          v-if="habitData.target"
          text="Цель"
          :data="habitData.target"
          :metrics="habitData.metrics"
        />
      </HabitDescription>
      <div class="flex justify-around w-full mt-8 lg:mt-[40vh]">
        <LoadFromFile @fileRead="onUpload">
          <label
            class="underline mt-2 max-w-[75%] text-center hover:cursor-pointer"
            for="load-file"
          >
            Есть экспортированная(ые) привычка(и)?
          </label></LoadFromFile
        >
      </div>
    </section>
  </main>
  <Toast />
</template>
