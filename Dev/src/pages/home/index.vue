<template>
	<section class="main-app">
		<div class="file-list-box">
			<header>
				<h1>
					<span>{{ title }}</span>
				</h1>
				<!-- 面包屑组件 自定义跳转方式 -->
				<VBreadcrumb 
					ref="vbreadcrumb" @sendBreadCrumbEvt="emitBreadCrumbEvt"
				></VBreadcrumb>
			</header>
			<main>
				<List/>
				<Article/>
			</main>
			<Footer/>
		</div>
	</section>

</template>

<script type="text/javascript">
import VBreadcrumb from '@ektx/v-breadcrumb'
import List from './parts/list'
import Footer from './parts/footer'
import Article from './parts/article'

import { mapActions, mapState } from 'vuex'

export default {
	name: 'home',
	components: {
		VBreadcrumb,
		List,
		Footer,
		Article
	},
	data () {
		return {}
	},
	computed: {
		...mapState('home', ['files', 'title'])
	},
	created () {
		// 默认请求地址
		this.getFileList(location.pathname)
	},
	methods: {
		...mapActions('home', ['getFileList']),

		// 面包屑回调功能
		emitBreadCrumbEvt (data) {
			this.getFileList(data.url)
		}
	},
	beforeRouteUpdate (to, from, next) {
		next()
		if (this.$refs.vbreadcrumb)
			this.$refs.vbreadcrumb.update()
	}
}
</script>
<style lang="less" src="./layout.less"></style>
<style lang="less" src="./markdown.less"></style>