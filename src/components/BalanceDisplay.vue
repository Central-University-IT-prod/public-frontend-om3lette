<script setup>
import { useStore } from 'vuex'
const store = useStore()
</script>

<template>
  <span class="bg-background-300 p-2 rounded-xl">Баланс: {{ store.getters.money }}</span>
</template>
