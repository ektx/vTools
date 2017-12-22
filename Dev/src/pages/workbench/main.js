
import io from '../../../static/js/socket.io.js'

export default {
	name: 'make',
	components: {},
	data () {
		return {
			// 线上 => location.origin 'http://localhost:9000/'
			socket: io.connect( location.origin ),
			// 所有文件
			files: [],
			// 处理完成的文件数
			doneFile: 0,
			// 过滤后显示的文件
			data: [],
			// 项目地址
			projectPath: '',
			// 项目是否可以输入
			editable: true,
			// 生成后文件地址
			outProPath: '',
			// 输出文件在files中的索引
			filesIndex: {},
			// 过滤查看文件功能
			filterFilesBtn: {
				holdIndex: 0,
				data: [
					{
						name: 'All',
						size: 0
					},
					{
						name: 'HTML',
						size: 0
					},
					{
						name: 'Css',
						size: 0
					},
					{
						name: 'Js',
						size: 0
					}
				]
			}
		}
	},
	watch: {
		files: function(newVal, oldVal){
			// 按钮统计 总数统计
			this.filterFilesBtn.data[0].size = newVal.length

			this.data = this.files

		}
	},
	methods: {
		// 发送项目
		sendProject: function () {

			this.doneFile = 0
			// 不可编辑项目地址了
			this.editable = false

			let getOutPath = (path) => {
				let _l = path.length;

				// 验证结尾是不是 / 结尾
				if (path.endsWith('/')) {
					path = path.slice(0, -1)
				}

				// 验证开头
				if (!path.startsWith('/')) {
					path = `/${path}`;
				}

				path = `${path}_HTML/`;


				return path
			}

			this.filterFilesBtn.holdIndex = 0
			this.files = []
			this.outProPath = getOutPath(this.projectPath);

			this.socket.emit('START_MAKE_PROJECT', {
				path: this.projectPath,
				out: this.outProPath
			})
		},

		/*
			过滤查看文件
		*/
		btnClick: function(index, evt) {
			this.filterFilesBtn.holdIndex = index

			this.filterFiles(index)
		},

		// 过虑显示功能
		filterFiles: function(index) {
			console.log(index)
			
			let filterKey = this.filterFilesBtn.data[index].name.toLocaleLowerCase()

			if (['html', 'js', 'css'].includes(filterKey)) {
				this.data = this.files.filter((val)=>{
					return val.to.toLocaleLowerCase().endsWith(`.${filterKey}`)
				})
			} else {
				this.data = this.files;
			}

		},

		// 打开项目目录
		openThisPro: function() {
			let name = this.projectPath.split('/')

			if (this.projectPath.endsWith('/')) {
				name = name[name.length - 2]
			} else {
				name = name[name.length - 1]
			}

			this.axios.post('/api/opendir', {
				path: this.projectPath,
				name
			})
			.then(res => {
				console.log(res)
			})
			.catch(err => {
				console.log(err)
			})
		}

	},

	mounted: function () {
		// 欢迎
		this.socket.on('HELLO_WORLD', data => {
			console.warn(data, this)
		})

		// 准备生成
		this.socket.on('WILL_GENERATE_FILE', data => {
			data.status = 'ready'
			let index = this.files.length

			// 保存数据的索引 方便后期更新状态
			this.filesIndex[data.to] = index
			this.files.unshift( data )
		})

		// 生成完成
		this.socket.on('GENERATE_MAKE_FILE', data => {
			// 查询索引，更新状态
			if (!!this.files[ this.filesIndex[data] ]) {
				this.doneFile += 1
				this.files[ this.filesIndex[data] ].status = 'done'
			}
		})

		// 出现错误
		this.socket.on('IO_ERROR_INFO', data => {
			console.error(data)
		})

		this.socket.on('PROJECT_DONE_SUCCESS', data => {
			setTimeout(() => {
				this.doneFile = 0
				this.editable = true
			}, 1000)
		})


		if (location.search)
			this.projectPath = decodeURIComponent(location.search.substr(6))
		
	}
}
		

// 自动追加项目地址
// window.onload = () => {

// 	filesBox.projectPath = decodeURI( location.search.substr(5) )
// }