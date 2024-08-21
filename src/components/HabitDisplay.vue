<script setup>
const props = defineProps(['text', 'data', 'metrics'])
</script>

<template>
  <div class="mb-3">
    <div class="space-x-1">
      <span class="space-x-1">
        <span>{{ props.text }}:</span>
        <span>{{ props.data }}</span>
      </span>
      <span v-if="props.metrics"> {{ props.metrics }} </span>
    </div>
  </div>
</template>
