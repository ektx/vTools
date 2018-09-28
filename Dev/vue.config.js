// https://cli.vuejs.org/zh/config/

module.exports = {
    // 生成时使用
    baseUrl: process.env.NODE_ENV === 'production' ? '/@/' : '',
    assetsDir: 'contents',
    devServer: {
        port: 8080,
        proxy: "http://localhost:9000"
    },
    productionSourceMap: false
}