<template>
  <div class="marked-box" v-html="inner"></div>
</template>

<script>
export default {
  name: 'markedVue',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inner: ''
    }
  },
  watch: {
    value: {
      handler () {
        this.showMarked()
      },
      immediate: true
    }
  },
  methods: {
    // 展示 markedown 文件
    async showMarked () {
      const marked = (await import(/* webpackChunkName: "marked" */ '@ektx/marked')).default

      // 添加 TOC
      let renderer = new marked.Renderer()
      this.inner = marked(this.value, {renderer})

      this.$nextTick(async function() {
        let codes = document.querySelectorAll('pre code')
        const HLJS = await import(/* webpackChunkName: "highlight" */ 'highlight.js')

        codes.forEach(code => {
          HLJS.highlightBlock(code)
        })
      })
    }
  }
}
</script>

<style lang="scss">
.marked-box {
  padding: 1em 2em;
  max-width: 800px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--mainColor);
  position: relative;

  &:empty {
    display: none
  }
    
  h1, h2, h3, h4, h5, h6 {
    margin: 1.5em 0 1em;
    color: var(--mainColor);
    font-weight: bolder;
    user-select: none;

    &:target {
      color: #E91E63;
      font-weight: bold;

      &::before {
        content: '👉🏻';
        display: inline-block;
      }
    }
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.8rem; }
  h3 { font-size: 1.6rem; }
  h4 { font-size: 1.4rem; }
  h5 { font-size: 1.2rem; }
  h6 { font-size: 1rem; }

  h1:after,
  h2:after,
  h3:after {
    content: '';
    display: block;
    border-bottom: 1px solid var(--mainLineColor);
    transition: border .4s ease-in-out;
  }

  ul, ol {
    padding: 0 0 0 2em;

    li {
      margin: 3px 0;
    }
  }
  ul {
    list-style: inherit;
    ul {
      list-style: circle;
      ul {
        list-style: square;
      }
    }
  }

  p {
    margin: .5em 0;
    line-height: 2rem;
  }

  a {
    color: #09f;
    font-weight: 400;

    &:hover {
      text-decoration: underline
    }
  }

  table {
    width: 100%;
    margin: 1rem 0;
    color: var(--mainColor);
    transition: color .4s ease-in-out;

    thead {
      background-color: var(--tableHeaderColor);
      transition: background-color .4s ease-in-out;
    }

    th {
      color: #888;
    }

    tr:nth-child(2n) {
      background-color: var(--subBGColor);
      transition: background-color .4s ease-in-out;
    }

    td, th {
      font-size: 1.15rem;
      padding: .5rem .6rem;
    }
  }

  /*  引用 */
  blockquote {
    margin: .5rem 0;
    padding: 3px 10px;
    border-left: 3px solid #4CAF50;
    background: var(--codeBgColor);
    border-radius: 0 2px 2px 0;
    transition: background-color .4s ease-in-out;
  }

  img {
    max-width: 100%;
  }

  em {
    font-style: italic;
  }

  code, kbd, pre, samp, tt {
    font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;
    font-size: 13px;
    -webkit-font-smoothing: initial;
    -moz-osx-font-smoothing: initial;
  }

  code:not(.hljs) {
    color: #4CAF50;
    padding: .25rem .5rem;
    margin: 0;
    font-size: .85em;
    border-radius: 3px;
    background-color: var(--codeBgColor);
    transition: background-color .4s ease-in-out;
  }

  pre {
    code.hljs {
      position: relative;
      margin: 1em 0;
      padding: 1em;
      max-height: 50em;
      line-height: 1.4;
      overflow: auto;
      border-radius: 3px;

      &:before {
        position: absolute;
        right: 1em;
        top: .5em;
        font-size: .7em;
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }

  code[class~=language-js]:before {
    content: "js"
  }

  code[class~=language-ts]:before {
    content: "ts"
  }

  code[class~=language-html]:before {
    content: "html"
  }

  code[class~=language-md]:before {
    content: "md"
  }

  code[class~=language-vue]:before {
    content: "vue"
  }

  code[class~=language-css]:before {
    content: "css"
  }

  code[class~=language-sass]:before {
    content: "sass"
  }

  code[class~=language-scss]:before {
    content: "scss"
  }

  code[class~=language-less]:before {
    content: "less"
  }

  code[class~=language-stylus]:before {
    content: "stylus"
  }

  code[class~=language-go]:before {
    content: "go"
  }

  code[class~=language-java]:before {
    content: "java"
  }

  code[class~=language-c]:before {
    content: "c"
  }

  code[class~=language-sh]:before {
    content: "sh"
  }

  code[class~=language-yaml]:before {
    content: "yaml"
  }

  code[class~=language-py]:before {
    content: "py"
  }

  code[class~=language-javascript]:before {
    content: "js"
  }

  code[class~=language-typescript]:before {
    content: "ts"
  }

  code[class~=language-markup]:before {
    content: "html"
  }

  code[class~=language-markdown]:before {
    content: "md"
  }

  code[class~=language-json]:before {
    content: "json"
  }

  code[class~=language-ruby]:before {
    content: "rb"
  }

  code[class~=language-python]:before {
    content: "py"
  }

  code[class~=language-bash]:before {
    content: "sh"
  }
}

</style>
