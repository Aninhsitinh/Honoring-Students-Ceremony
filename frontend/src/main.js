import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import { i18n } from './i18n'

import { createUnhead } from '@unhead/vue'

const app = createApp(App)
const head = createUnhead()

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(head)
app.mount('#app')
