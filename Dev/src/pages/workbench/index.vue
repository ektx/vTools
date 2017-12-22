<template>
	<section id="my-app">	
		<form class="workbench-form" novalidate="novalidate" v-on:submit.prevent="sendProject">
			<div class="usr-input-area">
				<input type="text" 
					placeholder="生成页面URL" 
					v-model='projectPath'
					:readonly="!editable"
				>
				<button type="reset">清空</button>

				<div class="process-bar" :style="{width: doneFile / files.length * 100 +'%'}"></div>
			</div>
			<!-- 辅助功能 -->
			<div class="accessibility-mod">
				<div class="pro-filder-box">
					<a v-on:click="openThisPro">打开项目目录</a>
					<a v-show="outProPath" :href="outProPath" target="_blank">查看生成项目</a>
				</div>

				<ul class="make-type-btns">
					<li v-for="(btn, index) in filterFilesBtn.data" 
						:class="[index === filterFilesBtn.holdIndex ? 'current': '']" 
						@click="btnClick(index, $event)">
							{{ btn.name }}<span>{{btn.size > 0 ? btn.size : ''}}</span>
					</li>
				</ul>
			</div>
		</form>

		<div id="make-files-box" class="make-ul-box">
			<ul class="make-list">
				<li v-for="val in data" :class="[val.status]">
					<i></i>
					{{val.file}} - {{val.from}}
				</li>
			</ul>

		</div>
	</section>
</template>

<script>
	import main from './main.js'
	export default main
</script>

<style lang="scss" scoped>
	@import './layout.scss'
</style>