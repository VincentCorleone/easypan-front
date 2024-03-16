import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/base.scss'
import App from './App.vue'
import router from './router'
import '@/assets/icon/iconfont.css'
import '@/assets/base.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.use(router)
app.use(ElementPlus)

import HlJsVuePlugin from "@highlightjs/vue-plugin"
import "highlight.js/styles/atom-one-light.css"
import "highlight.js/lib/common"
app.use(HlJsVuePlugin)

import EmailSender from './components/EmailSender.vue';
app.component("email-sender",EmailSender)

import UploadProgress from './views/UploadProgress.vue'
app.component('upload-progress',UploadProgress)

import Request from './utils/Request.js'
app.config.globalProperties.Request = Request

app.mount('#app')
