// https://cli.vuejs.org/zh/config/

module.exports = {
    devServer: {
        port: 8080,
        proxy: "http://localhost:9000"
    },
    productionSourceMap: false
}