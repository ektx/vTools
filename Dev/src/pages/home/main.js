
export default {
	name: 'home',
	data () {
		return {
			title: 'iTools'
		}
	},
	created: function() {
		axios.get('/')
			.then(res => {
				console.log(res)
			})
			.catch(err => {
				console.error(err)
			})
	}
}