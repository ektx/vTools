import axios from '../../assets/js/myAxios'
import router from '../../router'

export default {
    namespaced: true,
    state: {
        title: 'iServer',
        files: [],
        isServer: false,
        currentFile: null
    },
    mutations: {
        
        setFiles (state, list) {
            let fileArr = []
			let dirArr = []
            let sortArr = (arr) => {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
                return arr.sort((a,b) => new Intl.Collator(navigator.language, {caseFirst: "lower"}).compare(a.file, b.file) )
            }

			list.forEach(val => {
                val.classes = []

				if (val.isDir) {
					dirArr.push(val)
				} else {
					fileArr.push(val)

					if (/readme\.(md|markdown)/i.test(val.file)) {
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
        }
    },
    actions: {
        /**
         * 请求路径下文件内容
         * @param {store} context store内容
         * @param {string} url 地址
         */
        getFileList (context, url) {
            let root = location.pathname

            root = root.endsWith('/') ? root : `${root}/`

            if (url.startsWith('./')) {
                url = root + url.slice(2)
            }

            // 更新路由
            router.push(url)

            axios(`/api${url}`).then(res => {
                context.commit('setFiles', res.data)
                context.commit('setIsServer', res.server)
            }).catch(err => {
                console.error(err)
            })
        },

        // 打开本地文件夹
		askServerOpenDir (ctx, file) {
            // 不是自己启动的服务器，不可以打开本地文件
            if (!ctx.state.isServer) return

			let path = file.path

			if (!file.isDir) {
				path = path.replace(file.file, '')
			}

			axios({
				url: '/api/opendir',
				method: 'POST',
				data: {
					path,
					name: file.file 
				}
			}).then(data => {
				console.log(data)
			}).catch(err => {
                console.error(err)
            })
		},
    }
}