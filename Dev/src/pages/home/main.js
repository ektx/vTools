
import VBreadcrumb from '@/components/VBreadcrumb'


export default {
	name: 'home',
	components: {
		VBreadcrumb
	},
	data () {
		return {
			title: '',
			files: []
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

			url = '/api' + url

			this.axios.get(url)
				.then(res => {
					this.files = res.data
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
		} 
	}
}