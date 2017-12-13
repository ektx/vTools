import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Home from '@/pages/home'
import Workbench from '@/pages/workbench'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/@workbench',
			name: 'workbench',
			component: Workbench,
		},
		{
			path: '*',
			name: 'home',
			component: Home
		}
	]
})
