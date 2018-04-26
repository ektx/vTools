
import QRcode from 'qrcode'

export default {
	name: 'overlayer',
	data () {
		return {
			show: false,
			// 快速访问二维码
			QRBox: {
				img: null,
				text: ''
			}
		}
	},
	methods: {

		generateQRCode (status, data) {
			this.show = status
			this.QRBox.text = data

			QRcode.toDataURL(data, {
				width: 180 * window.devicePixelRatio,
				margin: 0
			}).then(url => {
					this.QRBox.img = url
				})
				.catch(err => {
					console.error(err)
				})

		}
	}
}