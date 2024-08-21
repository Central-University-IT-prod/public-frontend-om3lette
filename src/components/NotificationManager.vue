<script setup>
import { storageHandler } from '@/scripts/StorageHandler'
import { useRoute } from 'vue-router'
import { computed, toRaw, watch } from 'vue'
import notificationsData from '@/json/notifications.json'
import { randomEntry } from '@/scripts/random'

let notification
let habitData = storageHandler.getData()
let amountOfHabits = Object.keys(habitData.value).length
const route = useRoute()
const page = computed(() => route.name)

watch(page, () => {
  habitData = storageHandler.getData()
  amountOfHabits = Object.keys(habitData.value).length
})

function insertValuesIntoMessage(message, values) {
  return message.replace(/\{(.*?)}/g, (match, placeholder) => values[placeholder.trim()])
}

function getNotification() {
  const possibleNotifications = notificationsData[page.value]
  let notification

  switch (page.value) {
    case 'home':
      if (amountOfHabits === 0) {
        notification = possibleNotifications.empty
      } else {
        notification = possibleNotifications.reminder
      }
      break
    case 'habit':
      notification = possibleNotifications.create
      break
    case 'edit':
      notification = possibleNotifications.newAction
      break
    case 'visualize':
      notification = possibleNotifications.charts
      break
    case 'root':
      notification = possibleNotifications.start
      break
    default:
      break
  }
  if (!notification) return
  const selectedHabit = randomEntry(toRaw(habitData.value))
  if (selectedHabit)
    notification.body = insertValuesIntoMessage(notification.body, {
      title: selectedHabit.title
    })
  return notification
}

Notification.requestPermission().then((permission) => {
  if (permission !== 'granted') return
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const selectedNotification = getNotification()
      if (!selectedNotification) return
      notification = new Notification(selectedNotification.header, {
        body: selectedNotification.body,
        tag: page.value
      })
    } else {
      if (notification) notification.close()
    }
  })
})
</script>

<template><span></span></template>
