<template>
  <div class="v-code-moirror-box"></div>
</template>

<script>
import 'highlight.js/styles/atom-one-dark.css'

export default {
  name: 'VCodeMirror',
  props: {
    data: {
      style: String,
      default: ''
    },
    option: {
      style: Object
    }
  },
  data () {
    return {
      codeBox: '',
      myOption: {
        // 主题效果 https://codemirror.net/demo/theme.html#dracula
        theme: 'dracula'
      }
    }
  },
  watch: {
    data (val) {
      if (typeof val === 'object') {
        val = JSON.stringify(val, '', '\t')
      }
      this.codeBox.setValue(val)
    },
    option: {
      handler (val) {
        for (let key in val) {
          if (val[key] != this.myOption[key]) {
            this.codeBox.setOption(key, val[key])
            this.myOption[key] = val[key]
          }
        }
      },
      deep: true
    }
  },	
  async mounted () {
    const CodeMirror = (await import(/* webpackChunkName: "CodeMirror" */ 'codemirror')).default
    await import(/* webpackChunkName: "CodeMirror-js" */ 'codemirror/mode/javascript/javascript')
    await import(/* webpackChunkName: "CodeMirror-html" */ 'codemirror/mode/htmlmixed/htmlmixed')
    await import(/* webpackChunkName: "CodeMirror-go" */'codemirror/mode/go/go')
    await import(/* webpackChunkName: "CodeMirror-xml" */ 'codemirror/mode/xml/xml')
    await import(/* webpackChunkName: "CodeMirror-vue" */ 'codemirror/mode/vue/vue')
    await import(/* webpackChunkName: "CodeMirror-css" */ 'codemirror/mode/css/css')
    await import(/* webpackChunkName: "CodeMirror-lib-css" */ 'codemirror/lib/codemirror.css')
    await import(/* webpackChunkName: "CodeMirror-theme-dracula" */ 'codemirror/theme/dracula.css')

    this.myOption = Object.assign(this.myOption, this.option)
    this.codeBox = CodeMirror(this.$el, this.myOption)
  },
  methods: {
        
  }
}
</script>

<style lang="scss" scoped>
.v-code-moirror-box {
    height: 100%;

    /deep/ .CodeMirror {
        height: 100%;
    
        pre {
            font-size: 1.17rem;
        }
    }

}
</style>
