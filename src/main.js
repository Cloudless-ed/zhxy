import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/uu/iconfont.css'
import './assets/iconfont/em/iconfont.css'
import './assets/iconfont/em1/iconfont.css'
import './assets/iconfont/er/iconfont/iconfont.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// axios.defaults.baseURL = 'http://192.168.16.83:8443/api'
Vue.prototype.$axios = axios
    // Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
    router,
    store,
    render: function(h) { return h(App) }
}).$mount('#app')