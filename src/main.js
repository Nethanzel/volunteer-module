import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { es } from '@braid/vue-formulate-i18n'
import VueFormulate from '@braid/vue-formulate'

Vue.use(VueFormulate, { plugins: [es], locale: 'es', validationBehavior: "live" })
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
