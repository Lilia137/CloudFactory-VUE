// const proxyObj = {}
//
// proxyObj['/'] = {
//   // websocket
//   ws: false,
//   // 目标地址
//   target: 'http://localhost:8081',
//   // 发送请求头中host会设置成target
//   changeOrigin: true,
//   // 不重写请求地址
//   pathRewrite: {
//     '^/': '/'
//   }
// }
//
// // websocket的代理
// proxyObj['/ws'] = {
//   ws: true,
//   target: 'ws://localhost:8081'
// }
//
// module.exports = {
//   devServer: {
//     host: 'localhost',
//     port: 8080,
//     proxy: proxyObj
//   },
//   configureWebpack: {
//     devtool: 'source-map'
//   }
// }

module.exports = {
  devServer: {
    // contentBase: path.join(__dirname, "dist"),
    headers: {
      'X-foo': '112233'
    },
    hot: true,
    port: '8080',
    open: true,
    compress: true,
    proxy: {
      '/api': {
        target: 'http://news.baidu.com', // 目标接口的域名
        // secure: true,  // https 的时候 使用该参数
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
