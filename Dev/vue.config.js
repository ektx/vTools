// https://cli.vuejs.org/zh/config/

module.exports = {
    baseUrl: '/@/',
    assetsDir: 'contents',
    devServer: {
        port: 8080,
        proxy: "http://localhost:9000"
    },
    productionSourceMap: false
}