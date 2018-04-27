
import VBreadcrumb from '@/components/VBreadcrumb'
import VContextmenus from 'v-contextmenus'
import OverLayer from '@/components/overLayer'
import marked from 'marked'
import HLJS from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

export default {
	name: 'home',
	components: {
		VBreadcrumb,
		VContextmenus,
		OverLayer
	},
	data () {
		return {
			title: '',
			files: [],
			onServer: true,
			readmeInner: ''
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
			fetch('/api/opendir', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					path: file.path,
					name: file.file
				})
			})
			.then(res => res.json())
			.then(res => {
				console.log(res)
			})
			.catch(err => {
				console.error(err)
			})
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
						title: '前往工作台',
						evt: function() {
							let url = location.pathname + file.file;
							window.open( '/@workbench?path=' + url )
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

					if (/readme\.(md|markdown)/i.test(val.file)) this.catFileInner()
				}
			})

			dirArr = this.sortArr(dirArr)
			fileArr = this.sortArr(fileArr)

			return dirArr.concat(fileArr)
		},

		catFileInner () {
			fetch(`${location.href}readme.md`)
			.then(res => res.text())
			.then(res => {
					this.readmeInner = marked(res)

					this.$nextTick(function() {
						let codes = document.querySelectorAll('pre code')
						codes.forEach(code => {
							HLJS.highlightBlock(code)
						})
					})
				})
				.catch(err => {
					console.log(err)
				})
		}
	}
}