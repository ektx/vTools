// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VContextmenu from '@ektx/v-contextmenu/store'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {},
	mutations: {},
	modules: { VContextmenu }
})

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})


