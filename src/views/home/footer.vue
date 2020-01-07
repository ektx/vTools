<template>
  <footer>
    <span class="folder-info">
      <svg class="file-icon" version="1.1" viewBox="0 0 14 16">
        <path
          d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"
        />
      </svg>
      {{displayListCount}}
    </span>
    <ul class="current-file-info">
      <template v-if="hasCurrentFile">
        <li class="path" @click="opendir(currentFile)">
          <svg-icon icon="directory" class="path-icon" />
          {{currentFile.path}}
        </li>
        <li class="size">{{currentFile.stat.size | fileSize}}</li>
        <li class="extname">{{currentFile.type.slice(1).toUpperCase()}}</li>
      </template>
      <li class="face-box">
        <a href="https://github.com/ektx/iServer" :title="faceInfo" target="_blank">
          <svg v-if="showFace" class="warn-ico" viewBox="0 0 1024 1024">
            <path
              d="M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72S734.28992 161.28 540.5696 161.28z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536zM721.92 697.38496a30.72 30.72 0 0 1-42.72128-7.90528 168.28416 168.28416 0 0 0-138.6496-73.03168c-55.296 0-107.1104 27.29984-138.60864 73.03168a30.72 30.72 0 1 1-50.60608-34.85696 229.7856 229.7856 0 0 1 189.19424-99.6352c75.5712 0 146.3296 37.25312 189.25568 99.65568a30.69952 30.69952 0 0 1-7.86432 42.74176z"
            />
          </svg>

          <svg v-if="!showFace" class="normal-ico" viewBox="0 0 1024 1024">
            <path
              d="M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72s-156.99968-350.72-350.72-350.72z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m318.68928 238.73536a229.84704 229.84704 0 0 1-189.2352 99.6352 229.70368 229.70368 0 0 1-189.2352-99.65568 30.72 30.72 0 1 1 50.62656-34.816c31.45728 45.73184 83.29216 73.03168 138.62912 73.03168s107.13088-27.29984 138.6496-73.03168a30.72 30.72 0 0 1 42.72128-7.8848c13.9264 9.6256 17.44896 28.73344 7.84384 42.72128z"
            />
          </svg>
        </a>
      </li>
    </ul>
  </footer>
</template>

<script>
import filesize from "filesize";
import { mapState } from "vuex";
import homeMix from '../../mixins/homeMix';

export default {
  name: "footer-mod",
  mixins: [homeMix],
  data() {
    return {
      // 是否显示升级
      showFace: false,
      faceInfo: "v 7.5.0",
      version: "7.5.0"
    };
  },
  filters: {
    fileSize(val) {
      return filesize(val);
    }
  },
  computed: {
    ...mapState("home", ["currentFile", "displayListCount", 'hasCurrentFile'])
  },
  mounted() {
    this.getNewVersion();
  },
  methods: {
    getNewVersion() {
      if (navigator.onLine) {
        this.$axios({
          url:
            "https://raw.githubusercontent.com/ektx/iServer/master/package.json",
          methods: "GET"
        }).then(res => {
          if (res.version !== this.version) {
            this.showFace = true;
            this.faceInfo = `您需要升级，目前版本是: v${res.version}`;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";

footer {
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  height: 24px;
  color: #777;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 24px;
  overflow: hidden;
  background: var(--mainBGColor);
  border-top: 1px solid var(--mainLineColor);
  @include BGTransition;

  .folder-info {
    display: flex;
    margin-right: 5px;

    .file-icon {
      width: 10px;
      margin: 0 3px 0 0;
      fill: var(--mainColor);
    }
  }

  .current-file-info {
    flex: 1;
    display: flex;
    flex-direction: row;

    .path {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: color 0.3s ease-out;

      &:hover {
        color: #09f;
      }

      .path-icon {
        width: 12px;
        height: 12px;
        vertical-align: middle;
        fill: var(--mainColor);
      }
    }
    li:not(.path) {
      margin-left: 10px;
    }

    .face-box {
      svg {
        width: 18px;
        height: 100%;

        &.warn-ico path {
          fill: #f90;
        }
        &.normal-ico path {
          fill: #aaa;
        }
      }

      &:only-child {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
