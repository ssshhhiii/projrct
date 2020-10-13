import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import './plugins/element.js'
import '../src/assets/css/global.css'
import '../src/assets/fonts/iconfont.css'
import Treetable from "vue-table-with-tree-grid"
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config=>{
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
// 
Vue.prototype.$http=axios

Vue.config.productionTip = false

Vue.use(VueQuillEditor)

Vue.component('tree-table',Treetable)

Vue.filter('getDate',function(vail){
  const dt = new Date(vail) 
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const h=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${h}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
