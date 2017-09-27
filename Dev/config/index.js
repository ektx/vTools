// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    // 页面入口
    index: path.resolve(__dirname, '../dist/index.html'),
    // 文件生成位置
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 静态文件存放目录
    assetsSubDirectory: 'contents',
    // 设置项目静态文件的根请求位置,默认为 '/'
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    // 开发版本中端口
    port: 8080,
    autoOpenBrowser: false,
    // 开发版本中静态文件地址
    assetsSubDirectory: '/',
    assetsPublicPath: '/',
    // 添加本地代理
    // proxyTable: {
    //     '/api': {
    //         // 代理到本地的 mock 文件夹   
    //         target: 'http://localhost:9000/DataService/Dev/static/mock/',
    //         changeOrigin: true,
    //         pathRewrite: {
    //             // 将 请求替换成本地 mock json
    //             // /api/demo/helloworld.json => /demo/helloworld.json
    //             '^/api': ''
    //         }
    //     }
    // },
    // 云栖大会 api 代理
    proxyTable: {
        '/plugin': {
            target: 'http://192.168.4.148:8080/',
            changeOrigin: true,
            pathRewrite: {
                // 将 请求替换成本地 mock json
                // /api/demo/helloworld.json => /demo/helloworld.json
                // '^/api': '/'
            }
        }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
