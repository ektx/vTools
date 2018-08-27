<template>
	<section class="main-app">
		<div class="file-list-box">
			<header>
				<h1>
					<span @click="getFiles_c('../', $event)">{{ title }}</span>
				</h1>
				
			</header>
			<main>
				<ul class="file-list">
					<li v-for="file in files" :key="file.file">
						<svg v-if="!file.isDir" aria-hidden="true"  version="1.1" viewBox="0 0 12 16"><path d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>
						<svg v-else-if="file.isDir" aria-hidden="true" version="1.1" viewBox="0 0 14 16"><path d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>

						<a 
							v-if="file.isDir" 
							href="#" 
							@click.prevent="getFiles_c(file, $event)"
							@contextmenu.prevent="rightMenu(file, $event)"
						>
							{{ file.file }}
						</a>
						<a 
							v-if="!file.isDir" 
							target="_blank" 
							:href="'./'+file.file"
							@click.shift.prevent="askServerOpenDir(file)"
							@contextmenu.prevent="rightMenu(file, $event)"
						>{{ file.file }}</a>
					</li>
				</ul>

				<p class="folder-info">共有 {{files.length}} 个文件</p>
			</main>
			<footer>
				<!-- 面包屑组件 自定义跳转方式 -->
				<VBreadcrumb 
					ref="vbreadcrumb" v-on:sendBreadCrumbEvt="emitBreadCrumbEvt"
				></VBreadcrumb>
			</footer>
		</div>

		<section class="readme-box markdown-mod" v-html="readmeInner"></section>

		<VContextmenus/>

		<OverLayer ref="overlayermod" ></OverLayer>

	</section>

</template>

<script type="text/javascript" src="./main.js"></script>
<style lang="less" src="./layout.less"></style>
<style lang="less" src="./markdown.less"></style>