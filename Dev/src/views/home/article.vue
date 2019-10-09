<template>
  <article class="article-box">
    <VCode ref="code" v-show="fileType === 'code'" :data="code" :option="codeOption"></VCode>
    <vueMd v-if="fileType === 'markdown'" :value="markdownInner" />
    <div v-else-if="fileType === 'img'" class="img-box">
      <figure :style="imgStyle"></figure>
    </div>
  </article>
</template>

<script>
import VCode from "@/components/VCodeMirror";

import { mapState, mapActions } from "vuex";

export default {
  name: "article-mod",
  components: {
    VCode
  },
  data() {
    return {
      // markdown 文件内容
      markdownInner: "",
      // 文件的类型
      fileType: "text",
      // 代码内容
      code: "",
      // 代码显示配置
      codeOption: {
        lineNumbers: true,
        readOnly: true,
        mode: ""
      },
      articleBCR: {},
      // article
      articleEle: {},
      // 图片信息
      imgStyle: {},
      pathname: ""
    };
  },
  computed: {
    ...mapState("home", ["currentFile"])
  },
  watch: {
    currentFile(val) {
      // 防止多次加载，导致页面空白
      if (!val.name) return
      
      if (!val.isDir) {
        this.pathname = location.pathname.endsWith("/")
          ? location.pathname
          : `${location.pathname}/`;

        this.catFileInner(val);
      }
    }
  },
  mounted() {
    this.articleEle = this.$el;

    // 监听浏览器前进后退按钮功能
    if (history.pushState) {
      window.addEventListener(
        "popstate",
        () => {
          if (!this.$route.hash.length) {
            this.getFileList(this.$route.path);
          } else {
            if (location.hash) {
              let id = decodeURIComponent(location.hash);
              let ele = document.querySelector(id);
              this.$el.scrollTop = ele.offsetTop -90;
            }
          }
        },
        false
      );
    } else {
      // eslint-disable-next-line
      console.warn("您的浏览器不支持 History API，请升级您的浏览器！");
    }
  },
  methods: {
    ...mapActions("home", ["getFileList"]),

    getFileMode(file) {
      let { type } = file;
      let result = false;

      if (/\.png|jpg|gif|svg/i.test(type)) {
        this.fileType = "img";
        this.setImgStyle();
      } else if (/\.(htm|ejs|xml|jade|pug|php)/i.test(type)) {
        this.fileType = "code";
        result = "text/html";
      } else if (/\.(md|markdown)/i.test(type)) {
        this.fileType = "markdown";
        result = "markdown";
      } else if (/\.(js|jsx|json)/i.test(type)) {
        this.fileType = "code";
        result = "javascript";
      } else if (/\.(css|less|scss|sass|style)/i.test(type)) {
        this.fileType = "code";
        result = "css";
      } else if (/\.vue/i.test(type)) {
        this.fileType = "code";
        result = "text/x-vue";
      } else if (/\.txt/i.test(type)) {
        this.fileType = "code";
        result = "text/plain";
      } else {
        if ([".gitignore", ".eslintrc"].includes(file.name)) {
          this.fileType = "code";
          result = "bash";
        } else {
          this.fileType = "";
          result = false;
        }
      }

      return result;
    },

    /**
     * 查看文件
     * @param {Object} file 文件信息
     */
    async catFileInner(file) {
      let setMode = this.getFileMode(file);

      if (typeof setMode === "boolean" && !setMode) return;
      // TODO: 添加加载文件延迟功能
      this.$axios({
        url: this.pathname + file.name,
        method: "GET"
      }).then(res => {
        if (setMode === "markdown") {
          // this.showMarked(res)
          this.markdownInner = res;
        } else {
          this.code = res;
          this.codeOption.mode = setMode;
        }
      }).catch(err => {
        this.code = err.response.data;
        this.codeOption.mode = "text/plain";
      });
    },

    // 处理图片预览
    setImgStyle() {
      this.articleBCR = this.articleEle.getBoundingClientRect();
      let img = new Image();
      let src = `${this.pathname + this.currentFile.name}`;

      img.onload = () => {
        let { width: imgW, height: imgH } = img;

        if (imgH > this.articleBCR.height || imgW > this.articleBCR.width) {
          if (imgH > imgW) {
            imgW = imgW / (imgH / this.articleBCR.height);
            imgH = this.articleBCR.height;
          }
          // -
          else {
            imgH = imgH / (imgW / this.articleBCR.width);
            imgW = this.articleBCR.width;
          }
        }

        this.imgStyle = {
          background: `url(${src}) 50% 50% / 100% 100%`,
          width: `${imgW}px`,
          height: `${imgH}px`
        };
      };
      img.onerror = () => {
        // eslint-disable-next-line
        console.warn("图片处理时出现错误");
      };

      img.src = src;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";

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
      will-change: all;
      transition: all 300ms ease-in-out;
    }
  }
}
</style>