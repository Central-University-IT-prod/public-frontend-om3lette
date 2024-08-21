<script setup>
import { ref, computed, toRaw } from 'vue'
import HabitContainer from '@/components/HabitContainer.vue'
import Rating from 'primevue/rating'
import TimeTravel from '@/components/TimeTravel.vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { calculateData, options } from '../charts/home/pieConfig'
import { validateActions } from '@/scripts/validateActions'
import { storageHandler } from '@/scripts/StorageHandler'
import { useStore } from 'vuex'
import useScreen from '@/scripts/useScreen'

const store = useStore()
const currentDate = ref(store.getters.currentDate)
ChartJS.register(ArcElement, Tooltip, Legend)
const habitsData = storageHandler.getData()
const habitsDataValues = computed(() => Object.values(toRaw(habitsData.value)))

const [inProgress, finished, stars] = validateActions(habitsDataValues.value, currentDate.value)
const inProgressRef = ref(inProgress)
const finishedRef = ref(finished)
const starsRef = ref(stars)
const isLargeScreen = useScreen((width, height) => width >= 1024)
store.subscribe((mutation, state) => {
  if (mutation.type !== 'setCurrentDate') return
  const newDate = state.globalModule.currentDate
  currentDate.value = newDate
  const [newInProgress, newFinished, newStars] = validateActions(habitsDataValues.value, newDate)
  inProgressRef.value = newInProgress
  finishedRef.value = newFinished
  starsRef.value = newStars
})
const starsString = computed(() => {
  return `Рейтинг: ${starsRef.value}`
})
const pieChartData = computed(() =>
  calculateData(inProgressRef.value.length, finishedRef.value.length)
)
const displayMiddleSection = computed(() => {
  const data = pieChartData.value.datasets[0].data
  return data[0] + data[1] !== 0
})
</script>

<template>
  <main
    class="flex pb-6 xl:p-0 pt-8 xl:justify-around xl:flex-row xl:h-screen xl:items-stretch min-h-screen flex-col items-center"
  >
    <section class="flex flex-col justify-center">
      <label class="text-center" for="inProgress">Выполняются</label>
      <HabitContainer id="inProgress" :dataRef="inProgressRef" type="inProgress" />
    </section>
    <section class="flex items-center pt-10 pb-10 xl:p-0">
      <div class="flex flex-col justify-around h-2/3">
        <Pie v-if="displayMiddleSection" :data="pieChartData" :options="options" />
        <RouterLink to="/habit/" class="text-center pl-2 pr-2 underline" v-else
          ><h5>
            Чего же вы ждёте? <br />
            Давайте вместе создадим новую привычку!
          </h5></RouterLink
        >
        <div class="flex justify-center pt-8 xl:p-0">
          <Rating
            v-if="displayMiddleSection"
            v-tooltip.top="{ value: starsString }"
            class="scale-[300%]"
            :cancel="false"
            v-model="stars"
            :stars="3"
            readonly
          />
        </div>
      </div>
    </section>
    <section class="flex flex-col justify-center">
      <label class="text-center" for="finished">Закончены</label>
      <HabitContainer id="finished" :dataRef="finishedRef" type="finished" />
    </section>
  </main>
  <TimeTravel :show="isLargeScreen" />
</template>

<style></style>
