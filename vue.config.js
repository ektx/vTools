// https://cli.vuejs.org/zh/config/
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')

module.exports = {
  // 生成时使用
  publicPath: process.env.NODE_ENV === 'production' ? '/@/' : '/',
  assetsDir: 'contents',
  devServer: {
    port: 3000,
    proxy: "http://localhost:9000"
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css)(\?.*)?$/i,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })

    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, './src/assets/icons'))
      .end()

    config.module
      .rule('svg-icon')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, './src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'svg-icon-[name]'
      })
    
    let externals = {
      // 引用名: 全局对象
      vue: 'Vue',
      axios: 'axios',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'highlight.js': 'hljs',
      'socket.io-client': 'io'
    }

    if (process.env.NODE_ENV === 'production') {
      config.externals(externals)
    }

    const CDN = {
      css: [
        // '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/monokai-sublime.min.css'
      ],
      js: [
        '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
        '//cdn.jsdelivr.net/npm/vue-router@3.4.2/dist/vue-router.min.js',
        '//cdn.jsdelivr.net/npm/vuex@3.5.1/dist/vuex.min.js',
        '//cdn.jsdelivr.net/npm/axios@0.19.2/index.min.js',
        '//cdn.jsdelivr.net/npm/highlight@0.2.4/lib/highlight.js',
        '//cdn.jsdelivr.net/npm/socket.io@2.3.0/lib/client.js'
      ]
    }
    config.plugin('html')
      .tap(args => {
        args[0].cdn = CDN
        return args
      })
  }
}