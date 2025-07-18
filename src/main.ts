import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { useUmami } from './plugins/umami'

useUmami()

createApp(App).mount('#app')
