<script setup>
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import { dateToReadable } from '@/scripts/valueToReadable'
import { ref, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
const props = defineProps(['show'])
const store = useStore()
const currentDate = ref(store.getters.currentDate)
const newDate = reactive({ date: null, time: null })
const dateString = computed(() => {
  return dateToReadable(currentDate.value)
})
const visible = ref(false)
watch(newDate, (newValue) => {
  if (!newValue.date) return
  const time = newValue.time ?? '00:00'
  const date = new Date(newValue.date)
  const [hours, minutes] = time.split(':').map(Number)
  date.setHours(hours)
  date.setMinutes(minutes)
  currentDate.value = new Date(date)
  store.commit('setCurrentDate', date)
})
</script>

<template>
  <div class="w-screen justify-center xl:absolute xl:bottom-8 flex">
    <button
      v-if="props.show"
      @click="visible = true"
      class="min-w-24 space-x-2"
      icon="pi pi-clock"
      v-tooltip.top="{ value: dateString }"
    >
      <span>Задать время вручную</span>
      <i class="pi pi-clock"></i>
    </button>
  </div>
  <Dialog
    v-model:visible="visible"
    header="Измените текущее время"
    class="w-96"
    position="center"
    :modal="true"
    :draggable="false"
  >
    <span class="p-text-secondary block mb-5">Введите новое время</span>
    <div class="flex align-items-center gap-3 mb-5">
      <div class="flex items-center">
        <label for="email" class="font-semibold mb-0">Время</label>
      </div>
      <input v-model="newDate.time" type="time" />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <div class="flex items-center">
        <label for="email" class="font-semibold mb-0">Дата</label>
      </div>
      <Calendar
        v-model="newDate.date"
        dateFormat="dd-mm-yy"
        showIcon
        iconDisplay="input"
        inputId="currentDate"
      />
    </div>
    <div class="w-full flex justify-center">
      <Button type="button" label="Закрыть" severity="secondary" @click="visible = false"></Button>
    </div>
  </Dialog>
</template>
