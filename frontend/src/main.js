import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import './assets/main.css'

const app = createApp(App)

// Security Interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('currentUser')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

app.use(createPinia())
app.use(router)

app.mount('#app')
