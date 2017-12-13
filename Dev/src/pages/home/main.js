
import VBreadcrumb from '@/components/VBreadcrumb'
import VContextmenus from '@/components/VContextmenus'

export default {
	name: 'home',
	components: {
		VBreadcrumb,
		VContextmenus
	},
	data () {
		return {
			title: '',
			files: [],
			onServer: true
		}
	},
	created: function() {
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

			document.title = this.title

			url = '/api' + url

			this.axios.get(url)
				.then(res => {
					this.files = this.formatFileList( res.data.data )
					this.onServer = res.data.server
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
			console.log('will do open dir', file)

			this.axios.post('/api/opendir', {
				path: file.path,
				name: file.file
			})
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

			_.$store.commit('setContextmenu',  rightMenuData)

		},

		sortArr (arr) {
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
			return arr.sort( (a,b) => new Intl.Collator(navigator.language, {caseFirst: "lower"}).compare(a.file, b.file) )
		},

		formatFileList (data) {
			let fileArr = []
			let dirArr = []

			data.forEach(val => {
				val.isDir ? dirArr.push(val) : fileArr.push(val)
			})

			dirArr = this.sortArr(dirArr)
			fileArr = this.sortArr(fileArr)

			return dirArr.concat(fileArr)
		}


	}
}