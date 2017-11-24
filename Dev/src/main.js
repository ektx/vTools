// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import axios  from 'axios'

Vue.config.productionTip = false

Vue.prototype.axios = axios

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {},
	mutations: {
		setContextmenu (state, data) {
			if (Object.keys(data).length > 1) {
				state.contextmenu = data
			} else {
				state.contextmenu.show = data.show
			}

		}
	}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 根部注入 vuex stroe
  // 这样就可以全局访问，不用在组件里引用
  store,
  template: '<App/>',
  components: { App }
})


