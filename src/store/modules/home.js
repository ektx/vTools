import axios from '../../assets/js/myAxios'
import router from '../../router'

const state = {
  // 标题
  title: 'iServer',
  // 文件列表
  files: [],
  // 展示的文件列表
  displayListCount: 0,
  // 当前文件
  currentFile: {},
  hasCurrentFile: false,
}

const getters = {
  displayList: state => key => {
    let list = state.files.filter(i => i.name.toLowerCase().includes(key.toLowerCase()))
    state.displayListCount = list.length
    // 如果key有指定过滤内容 我们就把当前文件标记设置为false
    if (key) state.hasCurrentFile = false
    return list
  }
}

const mutations = {
  /**
   * 设置文件排序
   * @param {*} state 
   * @param {*} list 文件列表
   */
  setFiles (state, list) {
    let fileArr = []
    let dirArr = []

    let sortArr = arr => {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
      return arr.sort((a,b) => new Intl.Collator(navigator.language, {caseFirst: "lower"}).compare(a.name, b.name) )
    }

    list.forEach(val => {
      val.classes = []

      if (val.isDir) {
        dirArr.push(val)
      } else {
        fileArr.push(val)

        // 如果有read.md文件，默认展示
        if (/readme\.(md|markdown)/i.test(val.name)) {
          val.classes = ['current']
          state.currentFile = val
          state.hasCurrentFile = true
        }
      }
    })

    dirArr = sortArr(dirArr)
    fileArr = sortArr(fileArr)

    state.files = [...dirArr, ...fileArr]
  },

  setCurrentFile (state, file = {}) {
    
    if (state.currentFile) {
      state.currentFile.classes = []
    }

    if (!Object.keys(file).length) {
      state.hasCurrentFile = false
      return state.currentFile = file
    }

    file.classes = ['current']
    state.currentFile = file
    state.hasCurrentFile = true
  },

  setTitle (state) {
    let title = [...new Set(decodeURI(location.pathname).split('/'))].pop()
    state.title = title ? title : 'iServer'
    document.title = state.title
  },

}

const actions = {
  /**
   * 请求路径下文件内容
   * @param {store} ctx store内容
   * @param {string} url 地址
   */
  getFileList (ctx, url) {
    let root = location.pathname
        
    root = root.endsWith('/') ? root : `${root}/`
    url  = url.endsWith('/') ? url : `${url}/`
        
    if (url.startsWith('./')) {
      url = root + url.slice(2)
    }
    // 更新路由
    router.push(url).catch(err => {}) // eslint-disable-line
    ctx.commit('setTitle')
    ctx.commit('setCurrentFile', {})

    axios({
      url: '/api/filelist',
      method: 'GET',
      params: {
        path: url
      }
    }).then(res => {
      ctx.commit('setFiles', res)
    }).catch(err => {
      console.error(err) // eslint-disable-line
    })
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
