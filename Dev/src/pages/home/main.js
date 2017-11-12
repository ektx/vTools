
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
		this.refreshFilesList('iTools', location.pathname)


		if (history.pushState) {
			window.addEventListener('popstate', function(e) {
				that.refreshFilesList('iTools', location.pathname)
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

				this.refreshFilesList(file.file, url)

				// this.getAPI('/api' + url)
				// this.$router.push(url)
				// this.title = file.file
			}
		},

		// 刷新文件列表
		// @title {string|'iiTools'} 标题名称，默认为'iTools'
		// @url [string] 请求地址
		refreshFilesList (title = 'iTools', url) {

			// 更新地址栏
			this.$router.push(url)

			// 更新标题
			this.title = title

			url = '/api' + url

			this.axios.get(url)
				.then(res => {
					this.files = res.data
				})
				.catch(err => {
					console.error(err)
				})

		},

		emitBreadCrumbEvt (data) {
			console.log(data)
		}
	}
}