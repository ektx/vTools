import axios from '../../assets/js/myAxios'
import router from '../../router'

const state = {
    title: 'iServer',
    files: [],
    isServer: false,
    currentFile: null
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

                if (/readme\.(md|markdown)/i.test(val.name)) {
                    val.classes = ['current']
                    state.currentFile = val
                }
            }
        })

        dirArr = sortArr(dirArr)
        fileArr = sortArr(fileArr)

        state.files = [...dirArr, ...fileArr]
    },

    setIsServer (state, result) {
        state.isServer = result
    },

    setCurrentFile (state, file) {
        if (state.currentFile)
            state.currentFile.classes = []

        file.classes = ['current']
        state.currentFile = file
    },

    setTitle (state) {
        let title = [...new Set(decodeURI(location.pathname).split('/'))].pop()
        state.title = title ? title : 'iServer'
        document.title = state.title
    }
}

const actions = {
    /**
     * 请求路径下文件内容
     * @param {store} ctx store内容
     * @param {string} url 地址
     */
    getFileList (ctx, url) {
        console.log(url)
        let root = location.pathname
        
        root = root.endsWith('/') ? root : `${root}/`
        
        if (url.startsWith('./')) {
            url = root + url.slice(2)
        }
        
        // 更新路由
        router.push(url)
        ctx.commit('setTitle')

        axios({
            url: '/api/filelist',
            method: 'GET',
            params: {
                path: url
            }
        }).then(res => {
            ctx.commit('setFiles', res)
        }).catch(err => {
            console.error(err)
        })
    },

    // 打开本地文件夹
    opendir (ctx, file) {
        let path = file.path

        axios({
            url: '/api/opendir',
            method: 'GET',
            params: { path }
        }).then(data => {
            console.log(data)
        }).catch(err => {
            console.error(err)
        })
    },
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}