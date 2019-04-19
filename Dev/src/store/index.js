import Vue from 'vue'
import Vuex from 'vuex'

import home from '../views/home/store'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    modules: { home }
})