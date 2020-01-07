<template>
    <div class="v-code-moirror-box"></div>
</template>

<script>
import 'highlight.js/styles/atom-one-light.css'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/css/css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'

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
  mounted: function () {
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
