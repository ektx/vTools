// https://cli.vuejs.org/zh/config/

module.exports = {
    // 生成时使用
    // baseUrl: '/@/',
    assetsDir: 'contents',
    devServer: {
        port: 8080,
        proxy: "http://localhost:9000"
    },
    productionSourceMap: false
}