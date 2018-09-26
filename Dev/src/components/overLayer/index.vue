
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

<script src="./main.js"></script>

<style lang="less" scoped src="./layout.less"></style>
