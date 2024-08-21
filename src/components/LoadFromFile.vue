<script setup>
import { useToast } from 'primevue/usetoast'
const emit = defineEmits(['fileRead'])
const toast = useToast()
function handleFileInputChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.includes('json')) {
    wrongExtension(file.type.split('/')[1])
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    const data = reader.result
    if (data === '' || !data) {
      emptyFile()
      return
    }
    const result = JSON.parse(data)
    emit('fileRead', result)
  }
  reader.readAsText(file)
  e.target.value = null
}

function emptyFile() {
  toast.add({
    severity: 'error',
    summary: 'Пустой файл',
    detail: 'Данных в файле не обнаружено',
    life: 3000
  })
}

function wrongExtension(extension) {
  toast.add({
    severity: 'error',
    summary: 'Неправильное расширение',
    detail: `Получен файл .${extension} вместо .json`,
    life: 3000
  })
}
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <slot></slot>
    <input class="hidden" id="load-file" type="file" @change="handleFileInputChange" />
  </div>
</template>
