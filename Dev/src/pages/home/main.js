
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

		getFiles_c (file) {

			if (file.isDir) {
				let url = location.pathname + file.file + '/'
				console.log(url)

				this.refreshFilesList(url, file.file)

				// 更新面包屑
				this.$refs.vbreadcrumb.update()

				// this.getAPI('/api' + url)
				// this.$router.push(url)
				// this.title = file.file
			}
		},

		// 刷新文件列表
		// @url [string] 请求地址
		refreshFilesList (url) {
			let title = decodeURI(url).split('/').slice(-2).shift()

			// 更新地址栏
			this.$router.push(url.endsWith('/') ? url : `${url}/`)
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
		}
	}
}