import Vue from 'vue'
import axios from '@/assets/js/myAxios'
import VContextmenu from '@ektx/v-contextmenu'
import App from './App'
import router from './router'
import store from './store'
import './assets/icons'
import '@ektx/v-contextmenu/dist/vcontextmenu.css'

Vue.config.productionTip = false
Vue.use(VContextmenu)

Vue.prototype.$axios = axios

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')


