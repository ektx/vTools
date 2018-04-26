
<template>
	<section class="v-breadcrumb-com">
		<template v-if="hasEvt">
			<a @click.prevent="breadcrumb_c('/')" href="/">.</a>
			<a 
				v-for="(val, index) in hrefArr" 
				:key="index" 
				@click.prevent="breadcrumb_c(val.path)" 
				:href="val.path"
			>{{ val.name }}</a>
		</template>
		<template v-else>
			<a href="/">.</a>
			<a 
				v-for="val in hrefArr" 
				:href="val.path"
				:key="val"
			>{{ val.name }}</a>
		</template>
	</section>
</template>

<script>
	export default {
		name: 'v-breadcrumb',
		data () {
			return {
				hrefArr: [],
				hasEvt: false
			}
		},
		created: function() {
			
			this.formatURL(location.pathname)

			this.hasEvt = Object.keys(this.$listeners).length > 0

			// 监听浏览器前进后退按钮功能
			if (history.pushState && this.hasEvt) {
				window.addEventListener('popstate', (e) => {
					this.formatURL(location.pathname)
				}, false)
			}

		},
		methods: {
			breadcrumb_c (url) {
				
				// 更新面包屑
				this.formatURL( url )

				// 返回调用父级事件
				// 让父级可以自己处理页面与路由
				if (this.hasEvt) {
					this.$emit('sendBreadCrumbEvt', { url })
				}
			},
			
			/*
				格式化 url 地址并更新面包屑
				将 url 地址转化为数组对象
				[
					{
						name: 'home',
						path: '/home/'
					}
				]
			*/
			formatURL (url) {
				let _ = this
				let arr = decodeURI(url).slice(1,-1).split('/')

				_.hrefArr = []

				arr.forEach((val, i, arr) => {
					_.hrefArr.push({
						name: val,
						path: `/${arr.slice(0, i+1).join('/')}/`
					})
				})

			},

			update () {
				this.formatURL(location.pathname)
			}
		}
	}	
</script>

<style lang="scss">
	@import './layout.scss'
</style>