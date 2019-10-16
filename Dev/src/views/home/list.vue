<template>
  <aside>
    <header class="search-box">
      <VSearch 
        class="search-input" 
        placeholder="搜索" 
        v-model="searchInner" 
        :delay="300" 
        :focus="focusSearch"
        @blur="focusSearch = false"
      />
    </header>
    <ul class="file-list" @scroll="listScroll($event)">
      <li 
        v-for="(file, index) in listData" 
        :key="file.name" 
        :id="`id${file.name}`"
        :class="file.classes"
      >
        <svg v-if="file.isDir" version="1.1" viewBox="0 0 14 16">
          <path fill-rule="evenodd" 
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
    <overLayer ref="overlayermod"></overLayer>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import io from 'socket.io-client'
import homeMix from '../../mixins/homeMix'

export default {
  name: 'list-mod',
  mixins: [homeMix],
  props: {
    isServer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollObj: {},
      searchInner: '',
      focusSearch: false,
      // 当前文件的位置
      currentIndex: -1,
      keyEventting: false
    }
  },
  computed: {
    ...mapState('home', ['files', 'currentFile', 'displayListCount', 'hasCurrentFile']),
    ...mapGetters('home', ['displayList']),

    listData () {
      return this.displayList(this.searchInner)
    },
  },
  watch: {
    listData (val) {
      if (this.hasCurrentFile && !this.searchInner) {
        for (let i = 0; i <= this.displayListCount; i++) {
          if (val[i].name === this.currentFile.name) {
            return this.currentIndex = i
          }
        }
      }
    },
    // 更新当前的文件索引来更新选择的文件
    // （文件夹只是选中，并不是进入）
    currentIndex (val) {
      this.setCurrentFile(this.listData[val])
    },

    searchInner () {
      this.currentIndex = -1
    },

    // 路由变化后，重置索引 
    '$route' () {
      this.currentIndex = -1
    }
  },
  mounted() {
    // 读取缓存中的位置
    if (localStorage.scrollObj) {
      this.scrollObj = JSON.parse(localStorage.scrollObj);
    }
    // 监听键盘事件
    window.addEventListener('keydown', this.keyEvt, false)
    window.addEventListener('keyup', () => {
      this.keyEventting = false
    }, false)
    
    let socket = io()

    socket.on('FileEvent', msg => {
      console.log(msg)
    })
  },
  updated() {
    // 回显滚动条(非键盘事件时)
    if (!this.keyEventting && location.href in this.scrollObj) {
      let UL = this.$el.querySelector(".file-list")
      let scrollTop = this.scrollObj[location.href]

      UL.style.scrollBehavior = 'auto'
              
      this.$nextTick(() => {
        UL.scrollTop = scrollTop
        UL.style = ''
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
      // 清除查询条件
      this.searchInner = ''

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
            this.opendir(file)
          }
        },
        {
          title: "复制当前路径",
          evt() {
            if (navigator.clipboard) {
              navigator.clipboard
                .writeText(file.path)
                .then(() => {
                  // eslint-disable-next-line
                  console.log("Text copied to clipboard:", file.path);
                })
                .catch(err => {
                  // This can happen if the user denies clipboard permisions:
                  // eslint-disable-next-line
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
                // eslint-disable-next-line
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
              // eslint-disable-next-line
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
    },
    
    keyEvt (e) {
      // 键盘事件
      this.keyEventting = true

      if (e.metaKey) {
        switch (e.keyCode) {
        // F 时，快速查询功能
        case 70: {
          e.preventDefault()
          this.focusSearch = true
          break;
        }
        // 预览 HTML 功能
        case 86: {
          e.preventDefault();
          let link = document.querySelector('#to-preview');
          if (this.currentFile.type === '.html') {
            link.click();
          }
          break;
        }
        }
      } else {
        switch (e.keyCode) {
        case 13: {
          if (this.currentFile.isDir) {
            this.goFilePath(this.currentIndex, this.currentFile)
          }
          break
        }
        // 返回上级目录 
        case 37: {
          // 确保用户是在主界面触发功能
          if (e.target.nodeName !== 'BODY') return

          if (this.$route.path !== '/') {
            // 获取上级目录
            let path = this.$route.path.split('/').slice(0, -2).join('/')
        
            this.getFileList(path)
          }
          break;
        }
        case 38: {
          // 上
          this.changeFileIndex(e, -1)
          break;
        }
        // 进入下级目录
        case 39: {
          if (e.target.nodeName !== 'BODY') return
          break;
        }
        case 40: {
          // 下
          this.changeFileIndex(e, 1)
          break;
        }
        // 当用户点击 / 键时，返回到根目录
        case 191: {
          if (e.target.nodeName !== 'BODY') return
          this.getFileList(`/`)
          break;
        }
        }
      }
    },

    changeFileIndex (e, step) {
      // 当前事件触发的节点，是否是在查寻的框中
      let isSearchInt = document.querySelector('.v-search-inner').contains(e.target)
      // 在主界面时
      let isBody = e.target.nodeName === 'BODY'

      if (isBody || isSearchInt) {
        if (this.currentIndex + step > this.displayListCount -1) {
          this.currentIndex = -1
        } 
        else if (this.currentIndex + step < 0) {
          this.currentIndex = this.displayListCount
        }
        this.currentIndex += step

        // 更新显示当前选择的文件
        this.$nextTick(() => {
          document.querySelector(`.current`).scrollIntoView({
            block: "center"
          })
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/mixin.scss';

aside {
  position: relative;
  width: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--subBGColor);
  @include BGTransition;

  ul.file-list {
    flex: 1;
    padding: 10px 0;
    overflow: auto;
    box-sizing: border-box;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 2rem;
      padding: 0 0 0 .8em;

      svg {
        display: block;
        width: 1.1rem;

        path {
          fill: var(--mainColor);
          transition: fill .4s ease-in-out;
        }
      }
            
      div {
        flex: 1;
        padding: 0 0 0 5px;
        color: var(--mainColor);
        font-size: 1.2rem;
        word-break: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
        box-sizing: border-box;
        transition: color .3s ease-in-out;
      }

      &:hover,
      &.current {
        background: var(--listHover);
      }
    }
  }
}

.search-box {
  width: 100%;
  height: 36px;
  background: var(--subBGColor);
  @include BGTransition;

  .search-input {
    padding: 5px;
  }
}
</style>
