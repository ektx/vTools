<template>
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
</template>

<script>
import filesize from 'filesize'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'footer-mod',
    data () {
        return {
			// 是否显示升级
            showFace: false,
            faceInfo: 'v 7.4.1',
			version: '7.4.1',
        }
    },
    filters: {
		fileSize (val) {
			return filesize(val)
		}
	},
    computed: {
        ...mapState('home', ['files', 'currentFile'])
    },
    mounted () {
		this.getNewVersion()
    },
    methods: {
        ...mapActions('home', ['askServerOpenDir']),

        getNewVersion () {
			if (navigator.onLine) {
				this.axios({
					url: 'https://raw.githubusercontent.com/ektx/iServer/master/package.json',
					methods: 'GET'
				}).then(res => {
					if (res.version !== this.version) {
						this.showFace = true
						this.faceInfo = `您需要升级，目前版本是: v${res.version}`
					}
				})
			}
		},
    }
}
</script>
