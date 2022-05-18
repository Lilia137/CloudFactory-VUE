import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
// 将API方法绑定到全局
Vue.prototype.$http = axios
// 引用axios，并设置基础URL为后端服务api地址
axios.defaults.baseURL = 'http://localhost:8090/cfback_war_exploded'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
