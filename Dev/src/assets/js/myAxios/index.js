import axios from 'axios'

// 请求拦截器
axios.interceptors.request.use(
    config => {
    // 测试版本
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// 返回数据拦截器
axios.interceptors.response.use(
    res => res.data,
    err => {
        if (err.response) {
            // ...
        }
        return Promise.reject(err)
    }
)

export default axios