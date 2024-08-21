<script setup>
import { reactive } from 'vue'
import ProgressBar from 'primevue/progressbar'
import CardsRenderer from '@/components/CardsRenderer.vue'
const props = defineProps(['cards', 'playCallback', 'player', 'isBot', 'isTop'])
const classObject = reactive({
  'flex-col bottom-4': !props.isTop,
  'top-4 flex-col-reverse': props.isTop
})
</script>

<template>
  <div :class="classObject" class="player-ui absolute w-[93%] lg:w-3/4 flex items-center space-y-2">
    <div
      v-if="!props.isBot"
      class="player-cards flex justify-around w-full lg:w-1/2 space-x-2 xl:space-x-0"
    >
      <CardsRenderer
        :rotate="props.isTop"
        :items="props.cards"
        :clickCallback="
          (card) => {
            props.playCallback(card)
          }
        "
        :gameMode="true"
      ></CardsRenderer>
    </div>
    <div
      :class="{ 'flex flex-col-reverse rotate-180': props.isTop }"
      class="space-y-2 w-3/4 lg:w-1/2"
    >
      <div>
        <label for="player-hp">Здоровье</label>
        <ProgressBar id="player-hp" :value="props.player.hp" />
      </div>
      <div>
        <label for="player-stamina">Стамина</label>
        <ProgressBar id="player-stamina" :value="props.player.stamina * 10" />
      </div>
    </div>
  </div>
</template>
