<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useRouter, RouterLink } from 'vue-router'
import { computed, toRaw } from 'vue'
const props = defineProps(['dataRef', 'type'])
const router = useRouter()
function getSeverity(data) {
  if (['0', '1', '2'].includes(data)) return 'danger'
  if (['3', '4'].includes(data)) return 'warning'
  return 'success'
}

const newHabit = computed(() => {
  return toRaw(props.dataRef).length === 0 && props.type === 'inProgress'
})
const noFinishedHabits = computed(() => {
  return toRaw(props.dataRef).length === 0 && props.type === 'finished'
})

function goTo(page, id) {
  router.push(`/${page}/?id=${id}`)
}
</script>

<template>
  <div class="flex justify-center w-screen xl:w-[33vw] xl:block">
    <DataTable
      class="w-[85%] xl:w-full"
      :value="props.dataRef"
      tableStyle=""
      paginator
      :rows="5"
      removableSort
    >
      <div
        class="underline text-center bg-white pt-2 pb-2 rounded-tl-xl rounded-tr-xl"
        v-if="newHabit"
      >
        <RouterLink to="/habit/">Время создать новую привычку!</RouterLink>
      </div>
      <div
        class="text-center bg-white pt-2 pb-2 rounded-tl-xl rounded-tr-xl"
        v-if="noFinishedHabits"
      >
        Все привычки поддерживаются, так держать!
      </div>
      <Column sortable field="title" header="Привычка">
        <template #body="slotProps">
          <div class="relative p-2">
            <span v-text="slotProps.data.title"></span>
            <div
              class="space-x-2 justify-center flex items-center hover:border-4 rounded-lg border-secondary-950 group hover:opacity-85 hover:bg-secondary-950 z-[2] top-0 absolute w-full h-full"
            >
              <Tag
                @click="goTo('edit', slotProps.data.id)"
                class="hover:cursor-pointer items-center bg-opacity-15 bg-secondary-100 hidden group group-hover:flex"
                ><i class="text-secondary-100 pi pi-pencil"></i
              ></Tag>
              <Tag
                @click="goTo('visualize', slotProps.data.id)"
                class="hover:cursor-pointer items-center bg-opacity-15 bg-secondary-100 hidden group group-hover:flex"
                ><i class="text-secondary-100 pi pi-chart-bar"></i
              ></Tag>
            </div>
          </div>
        </template>
      </Column>
      <Column sortable field="category" header="Категория"></Column>
      <Column sortable class="flex items-center justify-center" field="mark" header="Оценка">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.mark"
            :severity="getSeverity(slotProps.data.mark)"
          /> </template
      ></Column>
    </DataTable>
  </div>
</template>
