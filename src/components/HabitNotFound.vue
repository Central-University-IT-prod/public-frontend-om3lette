<script setup>
import { computed } from 'vue'
const props = defineProps(['habitData'])
const showPopup = computed(() => !props.habitData || Object.keys(props.habitData).length === 0)
</script>

<template>
  <div
    v-if="showPopup"
    class="fixed top-0 left-0 z-10 w-screen h-screen flex items-center justify-center bg-background-50"
  >
    <h1 class="text-center">Привычка не найдена!</h1>
  </div>
</template>
