<script setup>
import SpeedDial from 'primevue/speeddial'
import Calendar from 'primevue/calendar'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { ref, reactive, onMounted, toRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storageHandler } from '@/scripts/StorageHandler'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Timeline from 'primevue/timeline'
import HabitNotFound from '@/components/HabitNotFound.vue'
import { dateToReadable } from '@/scripts/valueToReadable'
import { isInRange } from '@/scripts/getRange'
import { getConfig } from '@/speedDial.config'
import { useStore } from 'vuex'
import router from '@/router'

const store = useStore()
const currentDate = ref(store.getters.currentDate)
const actionsToRender = ref([])
const toast = useToast()
const route = useRoute()
const id = parseInt(route.query.id)
const actionData = reactive({ date: new Date(), value: 0 })
let habitData = reactive({})
let speedDialConfig = ref([])
const displayActionIcon = (actionValue) => {
  const suitableHabit = habitData.targetValue && habitData.period === 'daily'
  const greatPerformance = actionValue >= habitData.targetValue
  return suitableHabit && greatPerformance
}

function addAction() {
  const newAction = { ...toRaw(actionData) }
  const date = new Date(newAction.date)
  const startDate = new Date(habitData.date.start)
  let endRange

  if (habitData.targetValue && newAction.value <= 0) {
    toast.add({
      severity: 'error',
      summary: 'Отсутствие прогресса',
      detail: 'Прогресс неположительный. Действие не засчитано.',
      life: 3000
    })
    return
  }
  if (habitData.date.end) {
    const endDate = new Date(habitData.date.end)
    endRange = currentDate.value < endDate ? currentDate.value : endDate
  } else {
    endRange = currentDate.value
  }
  if (endRange < startDate) {
    toast.add({
      severity: 'warn',
      summary: 'Ошибка пространства и времени',
      detail: 'Эта привычка ещё не была создана!',
      life: 3000
    })
    return
  }
  if (!isInRange(date, startDate, endRange)) {
    toast.add({
      severity: 'warn',
      summary: 'Ошибка даты',
      detail: 'Выбранная дата не входит во временной промежуток привычки.',
      life: 3000
    })
    return
  }

  if (!habitData.targetValue) {
    delete newAction.value
  }
  habitData.actions.push(newAction)
  const timelineFormatAction = convertToTimelineFormat(newAction)
  actionsToRender.value.push(timelineFormatAction)
  storageHandler.saveData({ existingIndex: id, newData: habitData })
  toast.add({
    severity: 'success',
    summary: 'Новое действие',
    detail: `Добавлено новое действие ${timelineFormatAction.date} UTC`,
    life: 5000
  })
  let moneyEarned = 1

  if (habitData.period === 'weekly') moneyEarned = 2
  else if (habitData.period === 'monthly') moneyEarned = 3
  store.dispatch('earnMoney', moneyEarned)
  toast.add({
    severity: 'info',
    summary: 'Начисление средств',
    detail: `Добавлено чокопаев: ${moneyEarned}`,
    life: 5000
  })
}

onMounted(() => {
  if (id == 'null') {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: `Id привычки не было указано!`
    })
  } else {
    habitData = storageHandler.getHabitById(id)
    if (!habitData) return
    habitData.actions.forEach((action) => {
      actionsToRender.value.push(convertToTimelineFormat(action))
    })
    watch(
      habitData.date,
      () => {
        storageHandler.saveData({ existingIndex: id, newData: habitData })
      },
      { deep: true }
    )
    speedDialConfig.value = getConfig(habitData, id, currentDate.value, useRouter(), (id) => {
      storageHandler.deleteHabitById(id)
      router.push('/home')
    })
  }
})

function convertToTimelineFormat(action) {
  const status = action.value ?? 'Выполнено'
  const timelineFormat = {
    status,
    date: dateToReadable(action.date),
    originalDate: new Date(action.date)
  }
  return timelineFormat
}

watch(
  actionsToRender,
  () => {
    actionsToRender.value.sort((a, b) => {
      return new Date(b.originalDate) - new Date(a.originalDate)
    })
  },
  { deep: true }
)
</script>

<template>
  <HabitNotFound :habitData="habitData" />
  <main
    v-if="habitData"
    class="w-screen h-screen items-center md:items-stretch md:pt-14 flex justify-around flex-col md:flex-row"
  >
    <section class="w-[90%] md:w-auto">
      <div>
        <h2 class="text-center">Новое действие</h2>
        <div class="space-y-6">
          <div class="flex flex-col">
            <label for="time-selection" class="text-center md:text-left">Выберите время</label>
            <Calendar
              id="time-selection"
              v-model="actionData.date"
              inline
              showWeek
              :show-time="true"
            />
          </div>
          <div v-if="habitData.targetValue" class="flex flex-col items-center">
            <label for="action-value" class="text-center md:text-left">Введите значение</label>
            <InputNumber
              v-model="actionData.value"
              inputId="action-value"
              :minFractionDigits="0"
              :maxFractionDigits="2"
            />
          </div>
          <div class="flex justify-center">
            <Button
              @click="addAction"
              class="confirm-button mb-4 xl:mb-0"
              label="Добавить действие"
              icon="pi pi-check"
              iconPos="right"
            />
          </div>
        </div>
      </div>
    </section>
    <section class="pb-12 md:pb-0 w-[90%] md:w-auto flex flex-col items-center">
      <h3><label for="timeline" class="text-center">История действий (UTC)</label></h3>
      <div v-if="actionsToRender.length === 0">Активность не обнаружена</div>
      <Timeline id="timeline" :value="actionsToRender" class="max-h-[70vh] overflow-y-auto">
        <template #opposite="slotProps">
          <small class="p-text-secondary">{{ slotProps.item.date }}</small>
        </template>
        <template #content="slotProps">
          <span class="space-x-1 flex">
            <span>{{ slotProps.item.status }}</span>
            <span v-if="habitData.metrics">{{ habitData.metrics }}</span>
            <span v-if="displayActionIcon(slotProps.item.status)">
              <i class="pi pi-check"></i>
            </span>
          </span>
        </template>
      </Timeline>
    </section>
  </main>
  <SpeedDial
    :model="speedDialConfig"
    :tooltipOptions="{ position: 'right' }"
    :radius="100"
    direction="up-left"
    type="quarter-circle"
    class="fixed right-10 md:right-12 bottom-12 scale-150 bg-primary-500 rounded-3xl"
  />
  <Toast />
</template>
