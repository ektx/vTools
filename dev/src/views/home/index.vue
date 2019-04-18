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

		aside {
			width: 300px;
			overflow: hidden;
			background: #f5f5f5;

			ul.file-list {
				height: 100%;
				padding: 10px 0;
				overflow: auto;
				box-sizing: border-box;
	
				li {
					display: flex;
					flex-direction: row;
					height: 1.8rem;
					padding: 0 0 0 20px;
	
					svg {
						display: block;
						width: 1.1rem;
	
						path {
							fill: #333;
						}
					}
					
					div {
						flex: 1;
						padding: 0 0 0 5px;
						color: #333;
						font-size: 1.2rem;
						word-break: normal;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						cursor: pointer;
						box-sizing: border-box;
			
						&:hover {
							text-decoration: underline;
						}
					}

					&.current {
						background: rgb(224, 224, 224);
					}
				}
			}
		}

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

	footer {
		display: flex;
		flex-direction: row;
		padding: 0 20px;
		height: 24px;
		color: #777;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 24px;
		overflow: hidden;
		background: #fff;
		border-top: 1px solid #eee;

		.folder-info {
			width: 280px;
		}

		.current-file-info {
			flex: 1;
			display: flex;
			flex-direction: row;

			.path {
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				cursor: pointer;
				transition: color .3s ease-out;

				&:hover {
					color: #09f;
				}
			}
			li:not(.path) {
				margin-left: 10px;
			}

			.face-box {
				svg {
					width: 18px;
					height: 100%;

					&.warn-ico path {
						fill: #f90;
					}
					&.normal-ico path {
						fill: #aaa;
					}
				}

				&:only-child {
					flex: 1;
					display: flex;
					justify-content: flex-end;
				}

			}
		}
	}
}
</style>

<style lang="scss" src="./markdown.scss"></style>