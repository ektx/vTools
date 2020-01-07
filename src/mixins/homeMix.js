export default {
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
    // 打开本地文件夹
    opendir (file) {
      let path = file.path

      this.$axios({
        url: '/api/opendir',
        method: 'GET',
        params: { path }
      }).then(data => {
        console.log(data) // eslint-disable-line
      }).catch(err => {
        console.error(err) // eslint-disable-line
      })
    },
  }
}