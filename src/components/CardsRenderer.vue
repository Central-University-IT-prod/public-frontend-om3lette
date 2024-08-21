<script setup>
import Badge from 'primevue/badge'
const props = defineProps(['items', 'clickCallback', 'gameMode', 'rotate'])
</script>

<template>
  <div v-for="item in props.items" :key="item.id" :class="{ 'rotate-180': props.rotate }">
    <div
      class="bg-background-200 rounded-lg p-3 hover:cursor-pointer space-y-2 relative"
      @click="props.clickCallback(item)"
    >
      <div class="w-full flex flex-col items-center">
        <img
          class="size-24 tiny:size-28 xl:size-32 rounded-3xl"
          :src="`../cards/${item.fileName}.webp`"
          :alt="item.name"
        />
        <p v-if="!gameMode" class="text-text mt-3 mb-3 text-center">{{ item.name }}</p>
        <p v-if="!gameMode">Стоимость: {{ item.cost }}</p>
      </div>
      <div :class="{ gameCard: gameMode }" class="flex justify-around">
        <Badge v-tooltip.top="'Урон'" :value="item.damage" severity="danger"></Badge>
        <Badge v-tooltip.top="'Лечение'" :value="item.heal" severity="success"></Badge>
        <Badge v-tooltip.top="'Стамина'" :value="item.stamina" severity="info"></Badge>
      </div>
    </div>
  </div>
</template>
