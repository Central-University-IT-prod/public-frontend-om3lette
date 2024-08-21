<script setup>
import { ref } from 'vue'
import SlideIn from '@/components/SlideIn.vue'
import { useStore } from 'vuex'
import Button from 'primevue/button'
import { RouterLink } from 'vue-router'

const store = useStore()
const goodBehavior = ref(store.getters.goodBehavior)
const badBehavior = ref(store.getters.badBehavior)
setInterval(() => {
  store.commit('incrementBehaviorIndex')
  goodBehavior.value = store.getters.goodBehavior
  badBehavior.value = store.getters.badBehavior
}, 5000)
</script>

<template>
  <main class="flex flex-col lg:flex-row relative h-screen">
    <section class="w-6/12 h-screen relative hidden lg:block">
      <img
        class="w-[33vw] animate-wiggle rounded-2xl absolute left-[10vw] top-[18vh]"
        src="/smash.webp"
        alt="Нога"
      />
    </section>
    <section class="lg:w-6/12 h-screen right-0 flex flex-col justify-center">
      <div class="">
        <h2 class="text-center">Время дать бой вредным привычкам!</h2>
        <div class="">
          <h4
            class="lg:mb-7 mb-10 mt-7 flex flex-col space-y-10 items-center lg:block lg:space-y-0"
          >
            <span class="pr-1">Зачем</span>
            <SlideIn :message="badBehavior" />
          </h4>
          <h4 class="lg:mb-7 mb-10 flex flex-col space-y-10 items-center lg:block lg:space-y-0">
            <span class="pr-1">Если можно</span>
            <SlideIn :message="goodBehavior" />
          </h4>
          <div class="flex justify-center">
            <RouterLink class="" to="/home/">
              <Button
                class="p-1 mt-5 bg-primary-600 border-[8px] rounded-md border-primary-600 transition-all hover:translate-y-[-5px] hover:shadow-2xl"
                label="Поехали"
                icon="pi pi-arrow-up-right"
                iconPos="right"
            /></RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style></style>
