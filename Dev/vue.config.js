// https://cli.vuejs.org/zh/config/
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  // 生成时使用
  publicPath: process.env.NODE_ENV === 'production' ? '/@/' : '/',
  assetsDir: 'contents',
  devServer: {
    port: 8080,
    proxy: "http://localhost:8000"
  },
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
  }
}