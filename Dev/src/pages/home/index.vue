<template>
	<section class="main-app">
		<div class="file-list-box">
			<header>
				<h1>
					<span>{{ title }}</span>
				</h1>
				<!-- 面包屑组件 自定义跳转方式 -->
				<VBreadcrumb 
					ref="vbreadcrumb" @sendBreadCrumbEvt="emitBreadCrumbEvt"
				></VBreadcrumb>
			</header>
			<main>
				<aside>
					<ul class="file-list" @scroll="listScroll($event)">
						<li v-for="(file, index) in files" :key="file.file" :class="file.classes">
							<svg v-if="!file.isDir" aria-hidden="true" version="1.1" viewBox="0 0 12 16">
								<path d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path>
							</svg>
							<svg v-else-if="file.isDir" aria-hidden="true" version="1.1" viewBox="0 0 14 16">
								<path d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path>
							</svg>
							<div
								@click="goFilePath(index, file, $event)"
								@click.shift.prevent="askServerOpenDir(file)"
								@contextmenu.prevent="rightMenu(file, $event)"
							>{{file.file}}</div>
						</li>
					</ul>
				</aside>
				<article class="article-box">
					<VCode 
						ref="code"
						v-show="fileType === 'code'"
						:data="code" 
						:option="codeOption"
					></VCode>
					<div v-if="fileType === 'markdown'" class="readme-box" v-html="markdownInner"></div>
					<div v-else-if="fileType === 'img'" class="img-box">
						<figure :style="imgStyle"></figure>
					</div>

				</article>
			</main>
			<footer>
				<p class="folder-info">共有 {{files.length}} 个文件</p>
				<ul class="current-file-info">
					<template v-if="currentFile">
					<li class="path" @click="askServerOpenDir(currentFile)">{{currentFile.path}}</li>
					<li class="size">{{currentFile.stats.size | fileSize}}</li>
					<li class="extname">{{currentFile.extname.slice(1).toUpperCase()}}</li>
					</template>
					<li class="face-box">
						<a href="https://github.com/ektx/iServer" :title="faceInfo" target="_blank">
							<svg v-if="showFace" class="warn-ico" viewBox="0 0 1024 1024">
								<path d="M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72S734.28992 161.28 540.5696 161.28z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536zM721.92 697.38496a30.72 30.72 0 0 1-42.72128-7.90528 168.28416 168.28416 0 0 0-138.6496-73.03168c-55.296 0-107.1104 27.29984-138.60864 73.03168a30.72 30.72 0 1 1-50.60608-34.85696 229.7856 229.7856 0 0 1 189.19424-99.6352c75.5712 0 146.3296 37.25312 189.25568 99.65568a30.69952 30.69952 0 0 1-7.86432 42.74176z"></path>
							</svg>

							<svg v-if="!showFace" class="normal-ico" viewBox="0 0 1024 1024" >
								<path d="M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72s-156.99968-350.72-350.72-350.72z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m318.68928 238.73536a229.84704 229.84704 0 0 1-189.2352 99.6352 229.70368 229.70368 0 0 1-189.2352-99.65568 30.72 30.72 0 1 1 50.62656-34.816c31.45728 45.73184 83.29216 73.03168 138.62912 73.03168s107.13088-27.29984 138.6496-73.03168a30.72 30.72 0 0 1 42.72128-7.8848c13.9264 9.6256 17.44896 28.73344 7.84384 42.72128z"></path>
							</svg>
						</a>
					</li>
				</ul>
			</footer>
		</div>

		<OverLayer ref="overlayermod" ></OverLayer>

	</section>

</template>

<script type="text/javascript" src="./main.js"></script>
<style lang="less" src="./layout.less"></style>
<style lang="less" src="./markdown.less"></style>