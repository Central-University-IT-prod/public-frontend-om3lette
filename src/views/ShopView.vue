<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Toast from 'primevue/toast'
import cardsData from '@/json/shopItems.json'
import ConfirmDialog from 'primevue/confirmdialog'
import CardsRenderer from '@/components/CardsRenderer.vue'

const confirm = useConfirm()
const store = useStore()
const money = ref(store.getters.money)
const boughtCards = store.getters.boughtCards
const toast = useToast()
function confirmPurchase(item) {
  if (boughtCards.includes(item.id)) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка покупки',
      detail: `Предмет ${item.name} уже куплен`,
      life: 3000
    })
    return
  }
  confirm.require({
    message: `Вы хотите купить ${item.name}?`,
    header: 'Подтвеждение',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Нет',
    acceptLabel: 'Да',
    accept: () => {
      validateTransaction(item)
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Отмена',
        detail: `Покупка ${item.name} отменена`,
        life: 3000
      })
    }
  })
}

function validateTransaction(item) {
  if (money.value - item.cost < 0) {
    toast.add({
      severity: 'error',
      summary: 'Недостаточно средств',
      detail: `${money.value} / ${item.cost}`,
      life: 3000
    })
    return
  }
  boughtCards.push(item.id)
  money.value -= item.cost
  store.dispatch('chargeMoney', item.cost)
  store.dispatch('buyCard', boughtCards)
  toast.add({
    severity: 'success',
    summary: `Покупка успешна`,
    detail: `${item.name} добавлен в инвентарь\nОстаток: ${money.value}`,
    life: 3000
  })
}
</script>

<template>
  <main class="flex flex-col w-screen min-h-screen mt-10 xl:mt-0">
    <section class="flex justify-center w-full">
      <h2>Магазин</h2>
    </section>
    <section
      class="w-full justify-center grid sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-10 pl-10 pr-10 lg:pl-20 lg:pr-20"
    >
      <CardsRenderer :items="cardsData" :clickCallback="confirmPurchase"></CardsRenderer>
    </section>
  </main>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>
