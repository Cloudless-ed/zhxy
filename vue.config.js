module.exports = {

    // 选项...
    // devServer: {

    //     proxy: {
    //         '/api': {
    //             target: 'http://shengxian.appsike.com/m/molie/',
    //             // secure:false,
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/api': ''
    //             }
    //         }
    //     }
    // }

    //vue-cli3.0 里面的 vue.config.js做配置
    devServer: {
        proxy: {
            '/api': { //这里最好有一个 /
                target: 'http://192.168.16.83:8090/', // 后台接口域名
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}