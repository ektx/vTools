import filesize from 'filesize'
import VBreadcrumb from '@ektx/v-breadcrumb'
import VContextmenus from '@ektx/v-contextmenu'
import OverLayer from '@/components/overLayer'
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
			markdownInner: '',
			// 代码内容
			code: '',
			// 代码显示配置
			codeOption: {
				lineNumbers: true,
				readOnly: true,
				mode: ''
			},
			// 图片信息
			imgStyle: {},
			// article
			articleEle: {},
			articleBCR: {},
			// 是否显示升级
			showFace: false,
			faceInfo: 'v 7.4.0',
			version: '7.4.0',
			scrollObj: {},
			// URL
			pathname: ''
		}
	},
	created () {
		// 默认请求地址
		this.refreshFilesList(location.pathname)

		// 监听浏览器前进后退按钮功能
		if (history.pushState) {
			window.addEventListener('popstate', e => {
				if (!this.$route.hash.length) {
					this.refreshFilesList(this.$route.path)
				} else {
					if (location.hash) {
						let ele = document.getElementById(location.hash.slice(1))
						this.articleEle.scrollTop = ele.offsetTop
					}
				}
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
	watch: {
		currentFile (val, old) {
			if (old && old.classes) old.classes = []
			val.classes = ['current']
		}
	},
	mounted () {
		// 读取缓存中的位置
		if (localStorage.scrollObj) {
			this.scrollObj = JSON.parse(localStorage.scrollObj)
		}

		this.articleEle = this.$el.querySelector('.article-box')
		
		this.getNewVersion()
	},
	methods: {
		getFiles_c (file, e) {
			// 如果用户用户点击同时按住了 shift 键
			// 我们打开文件夹
			if (e.shiftKey) return this.askServerOpenDir(file)

			let url = this.pathname + file.file

			this.refreshFilesList(url)
			// 更新面包屑
			this.$refs.vbreadcrumb.update()
		},

		// 刷新文件列表
		// @url [string] 请求地址
		refreshFilesList (url) {
			url = url.endsWith('/') ? url : `${url}/`

			let title = Array.from(new Set(decodeURI(url).split('/'))).pop()
			// 更新标题
			this.title = title ? title : 'iServer'
			// 更新 document title
			document.title = this.title
			
			this.$router.push(url)
			this.pathname = url

			fetch(`/api${url}`)
				.then(res => res.json())
				.then(res => {
					this.files = this.formatFileList( res.data )
					this.onServer = res.server
					
					// 回显滚动条
					if (location.href in this.scrollObj) {
						let scrollTop = this.scrollObj[location.href]
						this.$nextTick(() => {
							this.$el.querySelector('.file-list').scrollTop = scrollTop
						})
					}
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
		},

		rightMenu (file, evt) {
			let rightMenuData = []

			this.currentFile = file

			if (this.onServer) {
				rightMenuData.unshift(
					{
						title: '在系统中打开',
						evt: () => {
							this.askServerOpenDir(file)
						}
					},
					{
						title: '复制当前路径',
						evt () {
							if (navigator.clipboard) {
								navigator.clipboard.writeText(file.path)
									 .then(() => {
										console.log('Text copied to clipboard:', file.path)
									})
									.catch(err => {
										// This can happen if the user denies clipboard permisions:
										console.error(`Could not copy text: ${err}`)
									})
							} else {
								const int = document.createElement('input')
								document.body.appendChild(int)
								int.value = file.path
								int.focus()
								int.select()
								const result = document.execCommand('copy')
								if (result === 'unsuccessful') {
									console.error('Faild to copy path')
								} else {
									document.body.removeChild(int)
								}
							}
						}
					},
					{
						type: 'separator'
					}
				)
			}

			rightMenuData.unshift(
				{
					title: '二维码访问',
					evt: (i, e) => {

						let generateQRcode = (data) => {
							let url = decodeURI(data + file.file)
							this.$refs.overlayermod.generateQRCode(true, url)
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
					}
				},
				{
					type: 'separator'
				}
			)

			this.$VContextmenu.show(rightMenuData, evt)

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
		// 展示 markedown 文件
		async showMarked (res) {
			const marked = (await import(/* webpackChunkName: "marked" */ 'marked')).default

			// 添加 TOC
			// https://marked.js.org/#/USING_PRO.md#renderer
			let renderer = new marked.Renderer()
			let toc = []
			let levelObj = {}

			renderer.heading = function (text, level) {
				if (level in levelObj) {
					levelObj[level] += 1
				} else {
					levelObj[level] = 1
				}

				let slug = encodeURI(text + '-' + levelObj[level])

				toc.push({
					level,
					slug,
					text,
					slug
				})

				return `<h${level} id="${slug}">${text}<a href="#${slug}" class="anchor"></a></h${level}>`
			}

			renderer.link = function (href, title, text) {
				let target = ''
				let end = ''

				if (href.startsWith('http')) {
					target = ' target="_blank" '
				}

				if (text.endsWith('  ')) {
					end = '<br/>'
				}

				return `<a href="${href}" ${target}>${text}</a>${end}`
			}
			
			renderer.paragraph = function (text) {
				let result = ''
				if (/\[toc\]/i.test(text)) {
					result = text
				} else {
					if (text.endsWith('  ')) {
						result = `${text}<br/>`
					} else {
						result = `<p>${text}</p>`
					}
				}

				return result
			}
			
			let html = marked(res, {renderer})
			let tocHtml = ``
			// 旧的级别
			let level = 0

			toc.forEach(val => {
				// 新建一个 ul
				if (level < val.level) {
					tocHtml += `<ul>`
				}
				// 相等时，表示为同级，只要为之前生成的 li 收尾
				else if (val.level === level) {
					tocHtml += `</li>`
				}
				// 小于时 表示现在需要返回上级 而上级的个数正好与级别差呈倍数
				else if (val.level < level) {
					tocHtml += `</li></ul>`.repeat(level - val.level)
				}

				tocHtml += `<li><a href="#${val.slug}">${val.text}</a>`

				// 将当前的级别赋值为老的级别 方便下次循环使用
				level = val.level
			})

			// 收尾 ul 因为前面我们并没有结束li与ul
			// ul与li都是在下次循环时进行收尾工作，最后一次需要人为处理
			tocHtml += `</li></ul>`.repeat(level)

			this.markdownInner = html.replace(/\[toc\]/i, tocHtml)

			this.$nextTick(async function() {
				let codes = document.querySelectorAll('pre code')
				const HLJS = await import(/* webpackChunkName: "highlight" */ 'highlight.js')

				codes.forEach(code => {
					HLJS.highlightBlock(code)
				})
			})
		},

		/** 
		 * 查看文件
		 * @param {Object} file 文件信息
		 */
		async catFileInner (file) {
			let setMode = ''
			
			setMode = this.getFileMode(file)

			if (typeof setMode === 'boolean' && !setMode) return

			this.axios({
				url: this.pathname + file.file,
				method: 'GET'
			}).then(res => {
				if (setMode === 'markdown') {
					this.showMarked(res)
				} else {
					this.code = res
					this.codeOption.mode = setMode
				}
			}).catch(err => {
				this.code = err.response.data
				this.codeOption.mode = 'text/plain'
			})
		},

		/**
		 * 处理文件路径
		 * @param {Number} index 索引
		 * @param {Object} file 文件信息
		 * @param {Event} evt 鼠标事件
		 */
		goFilePath (index, file, evt) {
			this.currentFile = file
			if (file.isDir) {
				// 缓存到本地
				localStorage.scrollObj = JSON.stringify(this.scrollObj)
				// 跳转
				this.getFiles_c(file, evt)
			} else {
				this.catFileInner(file)
			}
		},

		getFileMode (file) {
			let { extname } = file
			let result = false
			
			if (/\.png|jpg|gif/i.test(extname)) {
				this.fileType = 'img'
				this.setImgStyle()
			}
			else if (/\.(htm|ejs|xml|jade|pug|svg|php)/i.test(extname)) {
				this.fileType = 'code'
				window.open(`./${file.file}`)
				result = 'text/html'
			}
			else if (/\.(md|markdown)/i.test(extname)) {
				this.fileType = 'markdown'
				result = 'markdown'
			}
			else if (/\.(js|jsx|json)/i.test(extname)) {
				this.fileType = 'code'
				result = 'javascript'
			} 
			else if (/\.(css|less|scss|sass|style)/i.test(extname)) {
				this.fileType = 'code'
				result = 'css'
			} 
			else if (/\.vue/i.test(extname)) {
				this.fileType = 'code'
				result = 'text/x-vue'
			}
			else if (/\.txt/i.test(extname)) {
				this.fileType = 'code'
				result = 'text/plain'
			}
			else {
				if (['.gitignore', '.eslintrc'].includes(file.file)) {
					this.fileType = 'code'
					result = 'bash'
				} else {
					this.fileType = ''
					window.open(`./${file.file}`)
					result = false
				}
			}

			return result
		},

		// 处理图片预览
		setImgStyle () {
			this.articleBCR = this.articleEle.getBoundingClientRect()
			let img = new Image
			let src = `${this.pathname + this.currentFile.file}`

			img.onload = () => {
				let {width: imgW, height: imgH } = img

				if (imgH > this.articleBCR.height || imgW > this.articleBCR.width) {
					if (imgH > imgW) {
						imgW = imgW / (imgH / this.articleBCR.height)
						imgH = this.articleBCR.height
					} 
					// -
					else {
						imgH = imgH / (imgW / this.articleBCR.width)
						imgW = this.articleBCR.width
					}
				}

				this.imgStyle = {
					background: `url(${src}) 50% 50% / 100% 100%`,
					width: `${imgW}px`,
					height: `${imgH}px`
				}
			}
			img.onerror = () => {
				console.warn('图片处理时出现错误')
			}

			img.src = src
		},

		getNewVersion () {
			if (navigator.onLine) {
				this.axios({
					url: 'https://raw.githubusercontent.com/ektx/iServer/master/package.json',
					methods: 'GET'
				}).then(res => {
					if (res.version !== this.version) {
						this.showFace = true
						this.faceInfo = `您需要升级，目前版本是: v${res.version}`
					}
				})
			}
		},

		// 时时更新目录的滚动条位置
		listScroll (evt) {
			this.scrollObj[location.href] = evt.target.scrollTop
		}
	}
}