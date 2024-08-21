<script setup>
import { useRoute, useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { storageHandler } from '@/scripts/StorageHandler'
import * as bar from '@/charts/visualize/barConfig'
import * as line from '@/charts/visualize/lineConfig'
import Rating from 'primevue/rating'
import Button from 'primevue/button'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
import { validateActions } from '@/scripts/validateActions'
import { useStore } from 'vuex'
import HabitNotFound from '@/components/HabitNotFound.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const id = parseInt(route.query.id)
const toast = useToast()
let habitData
let outputData = ref(null)
const currentDate = ref(store.getters.currentDate)
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function goTo(name) {
  if (name === 'edit') {
    router.push(`/edit/?id=${id}`)
  } else {
    router.push('/home/')
  }
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
    outputData.value = validateActions([habitData], currentDate.value, true)[0]
    outputData.value.mark = parseInt(outputData.value.mark)
  }
})
</script>

<template>
  <HabitNotFound :habitData="habitData" />
  <main v-if="outputData" class="w-screen min-h-screen flex flex-col justify-around items-center">
    <article class="w-screen flex justify-center">
      <h3 class="w-5/6 text-center">Графические данные привычки "{{ habitData.title }}"</h3>
    </article>
    <section class="flex w-4/5 justify-around flex-col lg:flex-row">
      <div>
        <h4 class="text-center"><label for="success">Выполнение задач</label></h4>
        <div class="flex justify-center">
          <Bar
            id="success"
            :data="bar.calculateData(outputData.taskCompletion)"
            :options="bar.options"
          />
        </div>
      </div>
      <div>
        <h4 class="text-center">
          <label for="progress">Активность на промежутках</label>
        </h4>
        <div class="flex justify-center">
          <Line
            class=""
            id="progress"
            :data="line.calculateData(outputData.progress, habitData.period)"
            :options="line.options"
          />
        </div>
      </div>
    </section>
    <section class="pb-24">
      <h4 class="w-screen text-center">
        <label for="stars">Рейтинг соблюдения привычки</label>
      </h4>
      <div class="flex justify-center pt-4">
        <Rating
          id="stars"
          class="scale-[300%]"
          v-model="outputData.mark"
          readonly
          :cancel="false"
        />
      </div>
    </section>
    <footer class="w-screen fixed bottom-3 flex justify-center">
      <div class="w-full flex justify-around">
        <Button class="confirm-button" @click="goTo('edit')">Изменить</Button>
        <Button class="confirm-button" @click="goTo('home')">Главная</Button>
      </div>
    </footer>
  </main>
  <Toast />
</template>
@/scripts/validateActions @/scripts/StorageHandler
