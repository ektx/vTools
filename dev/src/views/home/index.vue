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
				<Bar/>
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
import Bar from './parts/bar'

import { mapActions, mapState } from 'vuex'

export default {
    name: 'home',
    components: {
        VBreadcrumb,
        List,
        Footer,
        Article,
        Bar
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
            console.log(111, data)
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

<style lang="scss">
.file-list-box {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;

	& > header {
		padding: 5px 20px;
		background: #fff;
		border-bottom: 1px solid #eee;

		h1 {
			color: #333;
			font-size: 20px;
			line-height: 32px;

			span {
				cursor: pointer;
			}
		}
	}

	main {
		display: flex;
		flex: 1;
		flex-direction: row;
		overflow: hidden;

		

		article {
			flex: 1;
			overflow: auto;
			overflow-x: hidden;
			scroll-behavior: smooth;
			background: #fff;

			.img-box {
				display: flex;
				width: 100%;
				height: 100%;
				justify-content: center;
				align-items: center;

				figure {
					will-change: background;
					transition: all 300ms ease-in-out;
				}
			}
		}
	}
}
</style>

<style lang="scss" src="./markdown.scss"></style>