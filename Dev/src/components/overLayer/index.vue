
<template>
	<!-- 遮盖层 -->
	<transition name="show-layer">
		<div v-show="show" class="over-layer" @click.self="show = !show">
			<!-- 二维码 -->
			<transition name="show-qrcode">
				<section v-show="show" class="ask-link-qrcode-mod">
					<div id="ask-link-qrcode-box">
						<img :src="QRBox.img">
					</div>
					<input type="text" readonly :value="QRBox.text">
				</section>
			</transition>
			<!-- // 二维码 -->
		</div>
	</transition>
</template>

<script>
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
</script>

<style lang="scss" scoped>
.over-layer {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 1000;
	background: rgba(0,0,0,.2);
}
.show-layer-enter-active,
.show-layer-leave-active {
	transition: background .5s;
	background: rgba(0,0,0,.2);
}
.show-layer-enter,
.show-layer-leave-to {
	background: rgba(0,0,0,0);
	transition: background .5s;
}

.ask-link-qrcode-mod {
	position: absolute;
	top: 50%;
	left: 50%;
	padding: 1em;
	border-radius: 3px;
	transform: translate(-50%, -50%);
	background: #fff;
	overflow: hidden;

	& /deep/ img {
		width: 180px;
		height: 180px;
	}

	input {
		width: 100%;
		padding: 1em 0 0;
		border: none;
		outline: none;
	}
}
.show-qrcode-enter-active,
.show-qrcode-leave-active {
	transition: opacity .5s, transform .5s;
	opacity: 1;
	transform: translate(-50%, -50%);
}
.show-qrcode-enter,
.show-qrcode-leave-to {
	opacity: 0;
	transition: opacity .5s, transform .5s;
	transform: translate(-50%, -30%);
}
</style>
