<template>
    <aside>
        <ul class="file-list" @scroll="listScroll($event)">
            <li v-for="(file, index) in files" :key="file.name" :class="file.classes">
                <svg v-if="file.isDir" version="1.1" viewBox="0 0 12 16">
                    <path
                        d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"
                    ></path>
                </svg>
                <svg v-else version="1.1" viewBox="0 0 14 16">
                    <path
                        d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"
                    ></path>
                </svg>
                <div
                    @click="goFilePath(index, file, $event)"
                    @contextmenu.prevent="rightMenu(file, $event)"
                >{{file.name}}</div>
            </li>
        </ul>
        <OverLayer ref="overlayermod"></OverLayer>
    </aside>
</template>

<script>
import OverLayer from "@/components/overLayer";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
    name: "list-mod",
    components: {
        OverLayer
    },
    data() {
        return {
            scrollObj: {}
        }
    },
    computed: {
        ...mapState("home", ["files", "currentFile", "isServer"])
    },
    mounted() {
        // 读取缓存中的位置
        if (localStorage.scrollObj) {
            this.scrollObj = JSON.parse(localStorage.scrollObj);
        }
    },
    updated() {
        // 回显滚动条
        if (location.href in this.scrollObj) {
            let scrollTop = this.scrollObj[location.href]
            
            this.$nextTick(() => {
                this.$el.querySelector(".file-list").scrollTop = scrollTop
            })
        }
    },
    methods: {
        ...mapActions("home", ["getFileList", "askServerOpenDir"]),
        ...mapMutations('home', ['setCurrentFile']),

        /**
         * 处理文件路径
         * @param {Number} index 索引
         * @param {Object} file 文件信息
         * @param {Event} evt 鼠标事件
         */
        goFilePath(index, file) {
            let { name, isDir } = file
            // 用于强制刷新页面
            if (this.currentFile && name === this.currentFile.name) {
                this.setCurrentFile({})
            }

            this.setCurrentFile(file)

            if (isDir) {
                // 缓存到本地
                localStorage.scrollObj = JSON.stringify(this.scrollObj)
                // 跳转
                this.getFileList(`./${name}/`)
            }
        },

        /**
         * 右键功能
         * @param {object} file 文件对象
         * @param {event} evt 鼠标事件
         */
        rightMenu(file, evt) {
            let rightMenuData = []

            if (this.isServer) {
                rightMenuData.unshift({
                    title: "在系统中打开",
                    evt: () => {
                        this.askServerOpenDir(file)
                    }
                },
                {
                    title: "复制当前路径",
                    evt() {
                        if (navigator.clipboard) {
                            navigator.clipboard
                                .writeText(file.path)
                                .then(() => {
                                    console.log("Text copied to clipboard:", file.path);
                                })
                                .catch(err => {
                                    // This can happen if the user denies clipboard permisions:
                                    console.error(`Could not copy text: ${err}`);
                                });
                        } else {
                            const int = document.createElement("input")
                            document.body.appendChild(int)
                            int.value = file.path
                            int.focus()
                            int.select()
                            const result = document.execCommand("copy")
                            if (result === "unsuccessful") {
                                console.error("Faild to copy path")
                            } else {
                                document.body.removeChild(int)
                            }
                        }
                    }
                },
                {
                    type: "separator"
                })
            }

            rightMenuData.unshift({
                title: "二维码访问",
                evt: () => {
                    let generateQRcode = url => {
                        url = decodeURI(url + file.name);
                        this.$refs.overlayermod.generateQRCode(true, url)
                    }

                    // 显示遮盖层
                    if (location.hostname === "localhost") {
                        this.$axios({
                            url: "/api/serverip",
                            method: "GET"
                        }).then(res => {
                            generateQRcode(location.href.replace("localhost", res.IPv4));
                        }).catch(err => {
                            console.error(err);
                        })
                    } else {
                        generateQRcode(location.href);
                    }
                }
            },
            {
                type: "separator"
            })

            this.$VContextmenu.show(rightMenuData, evt);
        },

        // 时时更新目录的滚动条位置
        listScroll (evt) {
            this.scrollObj[location.href] = evt.target.scrollTop
        }
    }
};
</script>
