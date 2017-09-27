<template>
	<div class="hello">
	<h1>{{ msg }}</h1>
	</div>
</template>

<script>
export default {
	name: 'hello',
	data () {
		return {
			msg: ''
		}
	},
	created: function() {
		this.msg = 'vue is created!';

		let localUrl = '/api/demo/helloworld.json';
		let serverUrl = '/plugin/yunXiBigScreen/testData.action';

		fetch(serverUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"name": "ektx"
			})
		})
		.then(res => res.json())
		.then(data => {
			this.msg = data.data.name
		})
		.catch(err => {
			console.error(err)
		})

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
	font-weight: normal;
}

</style>
