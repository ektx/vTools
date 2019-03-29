import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/assets/js/myAxios'
import VContextmenu from '@ektx/v-contextmenu'
import App from './App'
import router from './router'

import '@ektx/v-contextmenu/dist/vcontextmenu.css'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VContextmenu)

Vue.prototype.axios = axios

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')


