import './index.css'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice';

import {
  storageHandler
} from './scripts/StorageHandler'

const rootModule = {
  state: () => ({
    behaviorIndex: 0,
    badBehaviorList: ['играть в доту?', 'есть много конфет?'],
    goodBehaviorList: ['заниматься спортом', 'пить литр воды в день'],
  }),
  mutations: {
    incrementBehaviorIndex(state) {
      state.behaviorIndex++
    }
  },
  getters: {
    goodBehavior: state => {
      return state.goodBehaviorList[state.behaviorIndex % state.goodBehaviorList.length]
    },
    badBehavior: state => {
      return state.badBehaviorList[state.behaviorIndex % state.badBehaviorList.length]
    }
  }
}

const globalModule = {
  state: () => ({
    money: storageHandler.getMoney(),
    boughtCards: storageHandler.getCards(),
    currentDate: new Date(Date.now()),
  }),
  mutations: {
    setCurrentDate(state, newDate) {
      state.currentDate = newDate
    },
    earnMoney(state, paycheck) {
      state.money += paycheck
    },
    chargeMoney(state, charge) {
      state.money -= charge
    },
    buyCard(state, boughtCards) {
      state.boughtCards = boughtCards
    }
  },
  getters: {
    money: state => {
      return state.money
    },
    currentDate: state => {
      return state.currentDate
    },
    boughtCards: state => {
      return state.boughtCards
    }
  },
  actions: {
    earnMoney(context, value) {
      context.commit('earnMoney', value)
      storageHandler.updateMoneyValue(context.state.money)
    },
    chargeMoney(context, value) {
      context.commit('chargeMoney', value)
      storageHandler.updateMoneyValue(context.state.money)
    },
    buyCard(context, boughtCards) {
      context.commit('buyCard', boughtCards)
      storageHandler.updateBoughtCards(boughtCards)
    }
  }
}

const store = createStore({
  modules: {
    rootModule,
    globalModule
  }
})

const app = createApp(App)

app
  .use(router)
  .use(PrimeVue)
  .use(store)
  .use(ToastService)
  .use(ConfirmationService);
app.directive('tooltip', Tooltip);
app.mount('#app')
