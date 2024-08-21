<script setup>
const props = defineProps({
  message: {
    String,
    required: true
  }
})
</script>

<template>
  <Transition name="fade">
    <span :key="message" class="absolute text-accent-500 italic animation">{{
      props.message
    }}</span>
  </Transition>
</template>

<style>
.fade-enter-active {
  transition: all 2s;
}
.fade-enter-from, .fade-leave-to/* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.fade-enter-from {
  transform: translateY(-20px);
}
.fade-leave-active {
  transform: translateY(20px);
  transition: all 2s;
}
</style>
