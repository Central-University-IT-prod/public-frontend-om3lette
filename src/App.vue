<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import TimeTravel from '@/components/TimeTravel.vue'
import { computed, ref } from 'vue'
import Sidebar from 'primevue/sidebar'
import Button from 'primevue/button'
import BalanceDisplay from '@/components/BalanceDisplay.vue'
import NotificationManager from '@/components/NotificationManager.vue'

const route = useRoute()
const sideBarVisibility = ref(false)
const showNav = computed(() => {
  return route.path !== '/'
})
</script>

<template>
  <nav v-if="showNav" class="fixed top-4 right-8 space-x-4 z-20 hidden md:block">
    <RouterLink to="/habit/">Создать привычку</RouterLink>
    <RouterLink to="/shop/">Магазин</RouterLink>
    <RouterLink to="/game/">Игра</RouterLink>
    <RouterLink to="/home/"><i class="pi pi-home"></i></RouterLink>
    <BalanceDisplay />
  </nav>
  <nav class="fixed top-5 right-3 space-x-4 z-20 md:hidden">
    <Sidebar v-model:visible="sideBarVisibility" header="Страницы" position="full">
      <div class="flex flex-col h-full items-center justify-around">
        <RouterLink @click="sideBarVisibility = false" to="/habit/">Создать привычку</RouterLink>
        <RouterLink @click="sideBarVisibility = false" to="/shop/">Магазин</RouterLink>
        <RouterLink @click="sideBarVisibility = false" to="/game/">Игра</RouterLink>
        <RouterLink @click="sideBarVisibility = false" to="/home/">На главную</RouterLink>
        <TimeTravel show="true" />
        <BalanceDisplay />
      </div>
    </Sidebar>
    <Button icon="pi pi-align-justify" @click="sideBarVisibility = true" />
  </nav>
  <NotificationManager />
  <RouterView />
</template>
