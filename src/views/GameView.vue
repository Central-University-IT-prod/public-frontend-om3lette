<script setup>
import cards from '@/json/shopItems.json'
import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import CardsRenderer from '@/components/CardsRenderer.vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import Dropdown from 'primevue/dropdown'
import gameDifficulty from '@/json/gameDifficulty.json'
import opponentTypes from '@/json/opponentTypes.json'
import useScreen from '@/scripts/useScreen'
import { randomIntObject } from '@/scripts/random'
import LoadFromFile from '@/components/LoadFromFile.vue'
import downloadData from '@/scripts/downloadData'
import Toast from 'primevue/toast'
import PlayerUI from '@/components/PlayerUI.vue'
import { useToast } from 'primevue/usetoast'
import checkValues from '@/scripts/checkValues'

const store = useStore()
const router = useRouter()
const toast = useToast()

const isSmallScreen = useScreen((width, height) => height < 540)

const staminaConfig = { max: 10, rechargeTime: 2000 }
const selectedGameDifficulty = ref(1500)
const botConfig = reactive({
  timeBetweenMoves: selectedGameDifficulty,
  movesCount: 2,
  timeBeforeFirstMove: 500
})
const cardsPerPlayer = 3
let staminaInterval

const player = reactive({})
const availableCards = retrieveCards(store.getters.boughtCards)

let opponent = reactive({})
const showStartPopup = ref(true)
const opponentType = ref('bot')
const opponentCards = ref([])

const playerVictory = computed(() => opponent && opponent.hp <= 0)
const opponentVictory = computed(() => player && player.hp <= 0)
const isGameOver = computed(() => playerVictory.value || opponentVictory.value)
const isOpponentPlayer = computed(() => opponentType.value === 'player')
const allowMatchStart = computed(() => {
  const forPlayer = isOpponentPlayer.value && opponentCards.value.length > 0
  return forPlayer || opponentType.value === 'bot'
})

function retrieveCards(availableCardIds) {
  const availableCards = []
  availableCardIds.forEach((id) => {
    availableCards.push(cards[id])
  })
  return availableCards
}

function saveCards(cards) {
  if (cards.length === 0) {
    toast.add({
      severity: 'error',
      summary: 'Пустой файл',
      detail: 'В файле карт не обнаружено',
      life: 3000
    })
  }
  const fieldsToCheck = ['fileName', 'damage', 'heal', 'stamina', 'id']
  const missingField = checkValues(cards, fieldsToCheck)
  if (missingField) {
    toast.add({
      severity: 'error',
      summary: 'Битые данные',
      detail: `Карта не содержит поле '${missingField}'. Сделайте экспорт ещё раз`,
      life: 5000
    })
    return
  }
  opponentCards.value = cards
}
// lastPlayedCard is an array because of CardsRenderer
function usePlayer(availableCards) {
  const object = {
    hp: 100,
    stamina: staminaConfig.max,
    cards: getRandomCards(availableCards, cardsPerPlayer),
    availableCards,
    lastPlayedCard: []
  }
  return reactive(object)
}

function regenerateStamina() {
  staminaInterval = setInterval(() => {
    if (player.stamina < staminaConfig.max) {
      player.stamina++
    }
    if (opponent.stamina < staminaConfig.max) {
      opponent.stamina++
    }
  }, staminaConfig.rechargeTime)
}

function playCard(card, isTopPlayer) {
  const playerData = !isTopPlayer ? player : opponent
  const opponentData = isTopPlayer ? player : opponent
  if (playerData.stamina < card.stamina) return

  playerData.stamina -= card.stamina
  opponentData.hp -= card.damage
  playerData.hp = Math.min(100, playerData.hp + card.heal)
  const index = playerData.cards.indexOf(card)
  playerData.cards[index] = getRandomCard(playerData.availableCards)
  playerData.lastPlayedCard = [card]
}

function botMove(botData, opponentData) {
  if (isGameOver.value) return
  const moveIndex = randomIntObject(botConfig)
  // 0 - skip
  if (moveIndex === 1) {
    const cardToPlay = getRandomCard(botData.cards)
    playCard(cardToPlay, true)
  }
  setTimeout(() => {
    botMove(botData, opponentData)
  }, botConfig.timeBetweenMoves)
}

function getRandomCard(availableCards) {
  return availableCards[Math.floor(Math.random() * availableCards.length)]
}

function getRandomCards(availableCards, count) {
  const cards = []

  for (let i = 0; i < count; i++) {
    cards.push(getRandomCard(availableCards))
  }
  return cards
}

function goto(page) {
  if (page === 'home') {
    router.push('/home')
  }
}

watch(isGameOver, (newValue) => {
  if (newValue) clearInterval(staminaInterval)
})

function startGame() {
  const opponentAvailableCards = isOpponentPlayer.value ? opponentCards.value : cards
  Object.assign(player, usePlayer(availableCards))
  Object.assign(opponent, usePlayer(opponentAvailableCards))
  regenerateStamina()
  showStartPopup.value = false
  if (isOpponentPlayer.value) return
  setTimeout(() => {
    botMove(opponent, player)
  }, botConfig.timeBeforeFirstMove)
}
</script>

<template>
  <div
    v-if="isSmallScreen"
    class="flex w-screen h-screen fixed top-0 left-0 z-[15] bg-primary-200 justify-center items-center"
  >
    <h2 class="text-center">Пожалуйста, переведите экран в вертикальное положение.</h2>
  </div>
  <div
    class="w-screen min-h-screen absolute top-0 left-0 z-10 flex justify-center items-center flex-col gap-y-6 bg-primary-200 pb-8"
    v-if="showStartPopup"
  >
    <h1>Игра</h1>
    <article class="max-w-[75%] lg:max-w-[45%] 2xl:max-w-[30%]">
      <h2>Правила</h2>
      <div>
        <span>Каждому игроку выдаются 3 карты. При ходе выдается новая карта.</span>
        <span>Каждая карта обладает следующими характеристиками:</span>
        <ol class="flex flex-col items-baseline list-decimal">
          <li>Урон - наносит повреждение вашему оппоненту</li>
          <li>
            Лечение - восстанавливает вам здоровье (или наоборот, если значение отрицательное)
          </li>
          <li>Стамина - энергия, которую нужно потратить на розыгрыш карты</li>
        </ol>
        <p>Для победы необходимо опустить здоровье оппонента до 0 или меньше.</p>
        <p>Новые карты можно покупать в магазине.</p>
      </div>
    </article>
    <article v-if="isOpponentPlayer" class="max-w-[75%] lg:max-w-[45%] 2xl:max-w-[30%]">
      <h3>Как начать?</h3>
      <p v-if="isOpponentPlayer" class="">
        Режим игры против человека лучше не использовать на устройствах, не поддерживающих
        multitouch.
      </p>
      <p>
        Для игры с другим человеком попросите его экспортировать свои карты (левая кнопка) со своего
        устройста.
      </p>
      <p>Далее импортируйте их на вашем устройстве (правая кнопка)</p>
    </article>
    <div>
      <label for="gameDifficulty">Соперник</label>
      <Dropdown
        id="opponentSelection"
        v-model="opponentType"
        :options="opponentTypes"
        optionLabel="title"
        optionValue="value"
        placeholder="Компьютер"
      />
    </div>
    <div v-if="!isOpponentPlayer">
      <label for="gameDifficulty">Сложность</label>
      <Dropdown
        id="gameDifficulty"
        v-model="selectedGameDifficulty"
        :options="gameDifficulty"
        optionLabel="title"
        optionValue="value"
        placeholder="Легко"
      />
    </div>
    <div class="flex items-center space-x-6">
      <i
        @click="downloadData(availableCards, 'myCards.json')"
        v-tooltip.bottom="'Экспорт карт'"
        class="pi pi-upload scale-150 hover:cursor-pointer bg-accent-500 p-2 rounded-lg text-accent-50"
      ></i>
      <Button
        @click="startGame"
        :disabled="!allowMatchStart"
        label="Начать"
        class="confirm-button"
      />
      <LoadFromFile @fileRead="saveCards">
        <label
          for="load-file"
          :class="{ 'pointer-events-none': !isOpponentPlayer }"
          class="hover:cursor-pointer mb-0"
        >
          <i
            for="load-file"
            v-tooltip.bottom="'Импорт карт'"
            class="pi pi-download scale-150 hover:cursor-pointer bg-accent-500 p-2 rounded-lg text-accent-50"
          ></i
        ></label>
      </LoadFromFile>
    </div>
  </div>
  <div v-if="!showStartPopup" class="game-container flex justify-center">
    <PlayerUI
      :cards="opponent.cards"
      :playCallback="(card) => playCard(card, true)"
      :player="opponent"
      :isBot="!isOpponentPlayer"
      :isTop="true"
    />
    <div
      :class="{ 'top-[41vh]': isOpponentPlayer, 'top-1/4': !isOpponentPlayer }"
      class="opponent-played-card flex space-x-3 absolute"
    >
      <CardsRenderer :items="opponent.lastPlayedCard" :gameMode="true"></CardsRenderer>
      <CardsRenderer :items="player.lastPlayedCard" :gameMode="true" :rotate="true"></CardsRenderer>
    </div>
    <PlayerUI
      :cards="player.cards"
      :play-callback="playCard"
      :player="player"
      :isBot="false"
      :isTop="false"
    />
  </div>

  <div
    v-if="isGameOver"
    class="flex flex-col justify-center items-center absolute top-0 left-0 w-screen h-screen z-[2] bg-primary-200"
  >
    <h1 v-if="playerVictory" class="text-secondary-600 text-center">Вы победили!</h1>
    <h1 v-else class="text-red-600">Поражение</h1>
    <div class="flex justify-around w-full lg:w-1/3 mt-4">
      <Button @click="showStartPopup = true" label="Закрыть" class="confirm-button" />
      <Button @click="goto('home')" label="На главную" class="confirm-button" />
    </div>
  </div>
  <Toast />
</template>
