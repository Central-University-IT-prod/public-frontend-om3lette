import { ref, computed, onMounted } from 'vue'

export default function useScreen(condition) {
  const screenWidth = ref(window.innerWidth)
  const screenHeight = ref(window.innerHeight)
  const isScreen = computed(() => condition(screenWidth.value, screenHeight.value))
  const handleResize = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  return isScreen
}
