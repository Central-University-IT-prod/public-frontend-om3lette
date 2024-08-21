<script setup>
import HabitDisplay from '@/components/HabitDisplay.vue'
const props = defineProps(['habitData'])
</script>

<template>
  <div>
    <h2 class="text-center">Новая привычка</h2>
    <div class="mt-10 flex flex-col">
      <div>
        <h3>{{ props.habitData.title }}</h3>
      </div>
      <article>
        <HabitDisplay text="Категория" :data="props.habitData.category" />
        <slot> Других данных не обнаружено </slot>
      </article>
    </div>
  </div>
</template>
