import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/assets/js/myAxios'
import VContextmenu from '@ektx/v-contextmenu/store'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(Vuex)

Vue.prototype.axios = axios

const store = new Vuex.Store({
	state: {},
	mutations: {},
	modules: { VContextmenu }
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')


