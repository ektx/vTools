<template>
    <article class="article-box">
        <VCode 
            ref="code"
            v-show="fileType === 'code'"
            :data="code" 
            :option="codeOption"
        ></VCode>
        <markdownIt v-if="fileType === 'markdown'" :value="markdownInner"/>
        <div v-else-if="fileType === 'img'" class="img-box">
            <figure :style="imgStyle"></figure>
        </div>

    </article> 
</template>

<script>
import VCode from '@/components/VCodeMirror'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'article-mod',
    components: {
        VCode
    },
    data () {
        return {
            // markdown 文件内容
            markdownInner: '',
            // 文件的类型
            fileType: 'text',
            // 代码内容
            code: '',
            // 代码显示配置
            codeOption: {
                lineNumbers: true,
                readOnly: true,
                mode: ''
            },
            articleBCR: {},
            // article
            articleEle: {},
            // 图片信息
            imgStyle: {},
            pathname: ''
        }
    },
    computed: {
        ...mapState('home', ['currentFile'])
    },
    watch: {
        currentFile (val) {
            if (!val.isDir) {
                this.pathname = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`
    
                this.catFileInner(val)
            }
        }
    },
    mounted () {
        this.articleEle = this.$el

        // 监听浏览器前进后退按钮功能
        if (history.pushState) {
            window.addEventListener('popstate', () => {
                if (!this.$route.hash.length) {
                    this.getFileList(this.$route.path)
                } else {
                    if (location.hash) {
                        let ele = document.getElementById(location.hash.slice(1))
                        this.$el.scrollTop = ele.offsetTop
                    }
                }
            }, false)
        } else {
            console.warn('您的浏览器不支持 History API，请升级您的浏览器！')
        }
    },
    methods: {
        ...mapActions('home', ['getFileList']),

        getFileMode (file) {
            let { type } = file
            let result = false
			
            if (/\.png|jpg|gif|svg/i.test(type)) {
                this.fileType = 'img'
                this.setImgStyle()
            }
            else if (/\.(htm|ejs|xml|jade|pug|php)/i.test(type)) {
                this.fileType = 'code'
                result = 'text/html'
            }
            else if (/\.(md|markdown)/i.test(type)) {
                this.fileType = 'markdown'
                result = 'markdown'
            }
            else if (/\.(js|jsx|json)/i.test(type)) {
                this.fileType = 'code'
                result = 'javascript'
            } 
            else if (/\.(css|less|scss|sass|style)/i.test(type)) {
                this.fileType = 'code'
                result = 'css'
            } 
            else if (/\.vue/i.test(type)) {
                this.fileType = 'code'
                result = 'text/x-vue'
            }
            else if (/\.txt/i.test(type)) {
                this.fileType = 'code'
                result = 'text/plain'
            }
            else {
                if (['.gitignore', '.eslintrc'].includes(file.name)) {
                    this.fileType = 'code'
                    result = 'bash'
                } else {
                    this.fileType = ''
                    result = false
                }
            }

            return result
        },
        
        // 展示 markedown 文件
        async showMarked (res) {
            const marked = (await import(/* webpackChunkName: "marked" */ 'markdown-it')).default

            // 添加 TOC
            // https://marked.js.org/#/USING_PRO.md#renderer
            let renderer = new marked.Renderer()
            let toc = []
            let levelObj = {}

            renderer.heading = function (text, level) {
                if (level in levelObj) {
                    levelObj[level] += 1
                } else {
                    levelObj[level] = 1
                }

                let slug = encodeURI(text + '-' + levelObj[level])

                toc.push({
                    level,
                    slug,
                    text
                })

                return `<h${level} id="${slug}">${text}<a href="#${slug}" class="anchor"></a></h${level}>`
            }

            renderer.link = function (href, title, text) {
                let target = ''
                let end = ''

                if (href.startsWith('http')) {
                    target = ' target="_blank" '
                }

                if (text.endsWith('  ')) {
                    end = '<br/>'
                }

                return `<a href="${href}" ${target}>${text}</a>${end}`
            }
			
            renderer.paragraph = function (text) {
                let result = ''
                if (/\[toc\]/i.test(text)) {
                    result = text
                } else {
                    if (text.endsWith('  ')) {
                        result = `${text}<br/>`
                    } else {
                        result = `<p>${text}</p>`
                    }
                }

                return result
            }
			
            let html = marked(res, {renderer})
            let tocHtml = ``
            // 旧的级别
            let level = 0

            toc.forEach(val => {
                // 新建一个 ul
                if (level < val.level) {
                    tocHtml += `<ul>`
                }
                // 相等时，表示为同级，只要为之前生成的 li 收尾
                else if (val.level === level) {
                    tocHtml += `</li>`
                }
                // 小于时 表示现在需要返回上级 而上级的个数正好与级别差呈倍数
                else if (val.level < level) {
                    tocHtml += `</li></ul>`.repeat(level - val.level)
                }

                tocHtml += `<li><a href="#${val.slug}">${val.text}</a>`

                // 将当前的级别赋值为老的级别 方便下次循环使用
                level = val.level
            })

            // 收尾 ul 因为前面我们并没有结束li与ul
            // ul与li都是在下次循环时进行收尾工作，最后一次需要人为处理
            tocHtml += `</li></ul>`.repeat(level)

            this.markdownInner = html.replace(/\[toc\]/i, tocHtml)

            this.$nextTick(async function() {
                let codes = document.querySelectorAll('pre code')
                const HLJS = await import(/* webpackChunkName: "highlight" */ 'highlight.js')

                codes.forEach(code => {
                    HLJS.highlightBlock(code)
                })
            })
        },
        
        /** 
		 * 查看文件
		 * @param {Object} file 文件信息
		 */
        async catFileInner (file) {
            let setMode = this.getFileMode(file)

            if (typeof setMode === 'boolean' && !setMode) return

            this.$axios({
                url: this.pathname + file.name,
                method: 'GET'
            }).then(res => {
                if (setMode === 'markdown') {
                    // this.showMarked(res)
                    this.markdownInner = res
                } else {
                    this.code = res
                    this.codeOption.mode = setMode
                }
            }).catch(err => {
                this.code = err.response.data
                this.codeOption.mode = 'text/plain'
            })
        },
        
        // 处理图片预览
        setImgStyle () {
            this.articleBCR = this.articleEle.getBoundingClientRect()
            let img = new Image
            let src = `${this.pathname + this.currentFile.name}`

            img.onload = () => {
                let {width: imgW, height: imgH } = img

                if (imgH > this.articleBCR.height || imgW > this.articleBCR.width) {
                    if (imgH > imgW) {
                        imgW = imgW / (imgH / this.articleBCR.height)
                        imgH = this.articleBCR.height
                    } 
                    // -
                    else {
                        imgH = imgH / (imgW / this.articleBCR.width)
                        imgW = this.articleBCR.width
                    }
                }

                this.imgStyle = {
                    background: `url(${src}) 50% 50% / 100% 100%`,
                    width: `${imgW}px`,
                    height: `${imgH}px`
                }
            }
            img.onerror = () => {
                console.warn('图片处理时出现错误')
            }

            img.src = src
        },
    }
}
</script>
