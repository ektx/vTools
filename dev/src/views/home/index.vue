<template>
    <div :class="['file-list-box', theme]">
        <header>
            <div class="base-info">
                <h1>
                    <span>{{ title }}</span>
                </h1>
                <!-- 面包屑组件 自定义跳转方式 -->
                <VBreadcrumb 
                    ref="vbreadcrumb" @sendBreadCrumbEvt="emitBreadCrumbEvt"
                ></VBreadcrumb>
            </div>
            <ul class="setting-box">
                <li v-show="currentFile.type === '.html'" title="Preview">
                    <a id="to-preview" :href="currentFile.name" target="_blank">
                        <svg-icon icon="preview"/>
                    </a>
                </li>
                <li class="light" @click="toggleTheme" title="Toggle Theme">
                    <svg-icon icon="light"/>
                </li>
            </ul>
        </header>
        <main>
            <Bar/>
            <List/>
            <Article/>
        </main>
        <Footer/>
    </div>

</template>

<script type="text/javascript">
import VBreadcrumb from '@ektx/v-breadcrumb'
import List from './parts/list'
import Footer from './parts/footer'
import Article from './parts/article'
import Bar from './parts/bar'
import { mapActions, mapState, mapMutations } from 'vuex'

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
    ...mapState('home', ['title', 'theme', 'currentFile'])
  },
  created () {
    // 默认请求地址
    this.getFileList(location.pathname)
  },
  methods: {
    ...mapActions('home', ['getFileList']),
    ...mapMutations('home', ['setTheme']),

    // 面包屑回调功能
    emitBreadCrumbEvt (data) {
      this.getFileList(data.url)
    },
    // 切换主题
    toggleTheme () {
      this.setTheme(this.theme === 'day' ? 'night' : 'day')
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
@import '@/assets/css/mixin.scss';

.file-list-box {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;

	& > header {
        display: flex;
		padding: 5px 20px;
        align-items: center;
		background: var(--mainBGColor);
		border-bottom: 1px solid var(--mainLineColor);
        @include BGTransition;

        .base-info {
            flex: 1;
  
            h1 {
                color: var(--mainColor);
                font-size: 20px;
                line-height: 32px;

                span {
                    cursor: pointer;
                }
            }
        }

        .setting-box {
            display: flex;

            svg {
                width: 24px;
                height: 24px;
                fill: var(--waitColor);
                cursor: pointer;
                transition: fill .3s ease-in-out;

                &:hover {
                    fill: var(--mainColor);
                }
            }

            li {
                margin: 0 0 0 10px;
            }

            .light {
                svg {
                    width: 16px;
                }
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
			background: var(--mainBGColor);
            @include BGTransition;


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
