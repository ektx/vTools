
import filesize from 'filesize'
import VBreadcrumb from '@ektx/v-breadcrumb'
import VContextmenus from '@ektx/v-contextmenu'
import OverLayer from '@/components/overLayer'
import marked from 'marked'
import HLJS from 'highlight.js'
import VCode from '@/components/VCodeMirror'


export default {
	name: 'home',
	components: {
		VBreadcrumb,
		VContextmenus,
		OverLayer,
		VCode
	},
	data () {
		return {
			title: '',
			files: [],
			currentFile: null,
			onServer: true,
			// 文件的类型
			fileType: 'text',
			// markdown 文件内容
			readmeInner: '',
			// 代码内容
			code: '',
			// 代码显示配置
			codeOption: {
				lineNumbers: true,
				readOnly: true,
				mode: ''
			}
		}
	},
	created () {
		let that = this
		// 默认请求地址
		this.refreshFilesList(location.pathname)

		// 监听浏览器前进后退按钮功能
		if (history.pushState) {
			window.addEventListener('popstate', function(e) {
				that.refreshFilesList(location.pathname)
			}, false)
		} else {
			console.warn('您的浏览器不支持 History API，请升级您的浏览器！')
		}
	},
	filters: {
		fileSize (val) {
			return filesize(val)
		}
	},
	methods: {

		getFiles_c (file, e) {

			let url = ''

			// 如果用户用户点击同时按住了 shift 键
			// 我们打开文件夹
			if (e.shiftKey) {
				this.askServerOpenDir(file)
				return
			}

			if (file === '../') {
				url = `${location.pathname.split('/').slice(0,-2).join('/')}`
			} else {
				url = location.pathname + file.file
			}

			this.refreshFilesList(url)

			// 更新面包屑
			this.$refs.vbreadcrumb.update()

		},

		// 刷新文件列表
		// @url [string] 请求地址
		refreshFilesList (url) {

			url = url.endsWith('/') ? url : `${url}/`

			let title = decodeURI(url).split('/').slice(-2).shift()

			// 更新地址栏
			this.$router.push( url )
			// 更新标题
			this.title = title ? title : 'iTools'
			this.readmeInner = ''

			document.title = this.title

			fetch(`/api${url}`)
				.then(res => res.json())
				.then(res => {
					this.files = this.formatFileList( res.data )
					this.onServer = res.server
				})
				.catch(err => {
					console.error(err)
				})

		},

		// 面包屑回调功能
		emitBreadCrumbEvt (data) {
			this.refreshFilesList(data.url)
		},

		// 打开本地文件夹
		askServerOpenDir (file) {
			let path = file.path

			if (!file.isDir) {
				path = path.replace(file.file, '')
			}

			this.axios({
				url: '/api/opendir',
				method: 'POST',
				data: {
					path,
					name: file.file 
				}
			}).then(data => {
				console.log(data)
			})

			// fetch(, {
			// 	method: 'post',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify({
			// 		path: file.path,
			// 		name: file.file
			// 	})
			// })
			// .then(res => res.json())
			// .then(res => {
			// 	console.log(res)
			// })
			// .catch(err => {
			// 	console.error(err)
			// })
		},

		rightMenu (file, evt) {

			let _ = this
			let rightMenuData = {
				el: file,
				data: [
					{
						title: '下载',
						disabled: true
					},
					{
						type: 'separator'
					},
					{
						disabled: true,
						title: '删除'
					}
				],
				evt
			};

			if (this.onServer) {
				rightMenuData.data.unshift(
					{
						title: '在系统中打开',
						evt: function() {
							_.askServerOpenDir(file)
							_.$store.commit('setContextmenu', { show: false })

						}
					},
					{
						title: '重命名',
						disabled: true
					},
					{
						type: 'separator'
					}
				)
			}

			if (!file.isDir && /\.(md|markdown)$/i.test(file.file)) {
				rightMenuData.data.unshift(
					{
						title: '预览文件',
						evt: () => {
							this.catFileInner(file.file)
							_.$store.commit('setContextmenu', { show: false })
						}
					}
				)
			}

			rightMenuData.data.unshift(
				{
					title: '二维码访问',
					evt: function(i, e) {

						let generateQRcode = function(data) {
							let url = decodeURI(data + file.file)
							_.$refs.overlayermod.generateQRCode(true, url)
						}

						// 显示遮盖层
						if (location.hostname === 'localhost') {
							fetch(`/get-iserver-ip`)
								.then(res => res.json())
								.then(res => {
									generateQRcode( location.href.replace('localhost',  res.mes.IPv4.public) )
								})
								.catch(err => {
									console.error(err)
								})
						} else {
							generateQRcode(location.href)
						}

						_.$store.commit('setContextmenu', { show: false })
					}
				},
				{
					type: 'separator'
				}
			)

			_.$store.commit('setContextmenu',  rightMenuData)

		},

		sortArr (arr) {
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
			return arr.sort( (a,b) => new Intl.Collator(navigator.language, {caseFirst: "lower"}).compare(a.file, b.file) )
		},

		/**
		 * 格式化文件列表
		 * @param {object} data 数据列表
		 */
		formatFileList (data) {
			let fileArr = []
			let dirArr = []

			data.forEach(val => {
				if (val.isDir) {
					dirArr.push(val)
				} else {
					fileArr.push(val)

					if (/readme\.(md|markdown)/i.test(val.file)) {
						val.classes = ['current']
						this.currentFile = val
						this.catFileInner(val)
					}
				}
			})

			dirArr = this.sortArr(dirArr)
			fileArr = this.sortArr(fileArr)

			return dirArr.concat(fileArr)
		},

		/** 
		 * 查看文件
		 * @param {Object} file 文件信息
		 */
		catFileInner (file) {
			let setMode = ''
			this.markdown = false

			switch (file.extname) {
				case '.css':
				case '.scss':
				case '.sass':
				case '.less':
					setMode = 'css'
					break
				
				case '.vue':
					setMode = 'text/x-vue'
					break

				case '.js':
				case '.json':
					setMode = 'javascript'
					break

				case '.md':
				case '.markdown':
					this.markdown = true
					break

				case '.ejs':
				case '.xml':
					setMode = 'text/html'
					break

				// case '.html':
				// 	window.open(`./${file.file}`)
				// 	setMode = 'text/html'
				// 	return
				
				case '.svg':
					setMode = 'text/html'
					break
			}

			setMode = this.getFileMode(file)

			if (typeof setMode === 'boolean' && !setMode) return

			this.axios({
				url: location.href + file.file,
				method: 'GET'
			}).then(res => {
				if (this.markdown) {
					this.readmeInner = marked(res)

					this.$nextTick(function() {
						let codes = document.querySelectorAll('pre code')
						codes.forEach(code => {
							HLJS.highlightBlock(code)
						})
					})
				} else {
					this.code = res
					this.codeOption.mode = setMode
				}
			})
		},

		/**
		 * 处理文件路径
		 * @param {Object} file 文件信息
		 * @param {Event} evt 鼠标事件
		 */
		goFilePath (index, file, evt) {
			if (file.isDir) {
				this.getFiles_c(file, evt)
			} else {
				if (this.currentFile) {
					this.currentFile.classes = []
				}

				file.classes = ['current']
				this.currentFile = file
				this.catFileInner(file)
			}
		},

		getFileMode (file) {
			let { extname } = file
			let result = false
			console.log('code:', extname)

			if (/\.png|jpg|gif/i.test(extname)) {
				console.log('is img')
				this.fileType = 'img'
			}
			else if (/\.html/i.test(extname)) {
				this.fileType = 'code'
				result = 'text/html'
			}

			return result
		}
	}
}