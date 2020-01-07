<template>
  <div class="file-list-box">
    <header>
      <div class="base-info">
        <h1>
          <span>{{ title }}</span>
        </h1>
        <!-- 面包屑组件 自定义跳转方式 -->
        <VBreadcrumb ref="vbreadcrumb" @sendBreadCrumbEvt="emitBreadCrumbEvt"/>
      </div>
      <ul class="setting-box">
        <li v-show="currentFile.type === '.html'" title="Preview">
          <a id="to-preview" :href="currentFile.name" target="_blank">
            <svg-icon icon="preview" />
          </a>
        </li>
        <li class="light" @click="toggleTheme" title="Toggle Theme">
          <svg-icon icon="light" />
        </li>
      </ul>
    </header>
    <main>
      <Bar />
      <List :isServer="isServer"/>
      <Article />
    </main>
    <Footer />
  </div>
</template>

<script type="text/javascript">
import VBreadcrumb from "@ektx/v-breadcrumb";
import List from "./list";
import Footer from "./footer";
import Article from "./article";
import Bar from "./bar";
import { mapActions, mapState } from "vuex";

export default {
  name: "home",
  components: {
    VBreadcrumb,
    List,
    Footer,
    Article,
    Bar
  },
  data () {
    return {
      // 服务器环境
      isServer: false,
    }
  },
  computed: {
    ...mapState("home", ["title", "currentFile"])
  },
  created() {
    // 默认请求地址
    this.getFileList(location.pathname);
    this.getIsServer()
  },
  methods: {
    ...mapActions("home", ["getFileList"]),

    // 面包屑回调功能
    emitBreadCrumbEvt(data) {
      this.getFileList(data.url);
    },
    // 切换主题
    toggleTheme() {
      this.$parent.toggleTheme()
    },

    getIsServer () {
      this.$axios({
        url: '/api/isServer',
        method: 'GET'
      }).then(res => {
        this.isServer = res
      }).catch(err => {
        console.log(err)
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    next();
    if (this.$refs.vbreadcrumb) this.$refs.vbreadcrumb.update();
  }
};
</script>

<style lang="scss">
@import "@/assets/css/mixin.scss";

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
        transition: fill 0.3s ease-in-out;

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
  }
}
</style>
