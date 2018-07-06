// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './assets/js/sendlog'
import common from './assets/js/common'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  ak: 'FHrcSdw5oQIn1XEhkxRrznF4Fd1STE24'
})

Vue.config.productionTip = false
Vue.config.debug = true
Vue.prototype.$http = axios
Vue.use(common);

// import '@/permission' // 权限模块

/* eslint-disable no-new */
var a = new Vue({
  el: '#wrapper',
  router,
  store,
  template: '<App/>',
  components: { App },
})
