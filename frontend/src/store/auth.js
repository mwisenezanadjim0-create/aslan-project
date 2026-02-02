import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('currentUser')) || null,
        token: localStorage.getItem('token') || null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    },
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post('/api/auth/login', { email, password })
                this.token = response.data.token
                this.user = response.data.user

                localStorage.setItem('token', this.token)
                localStorage.setItem('currentUser', JSON.stringify(this.user))

                return { success: true }
            } catch (error) {
                console.error('Login error:', error)
                return {
                    success: false,
                    message: error.response?.data?.msg || 'Login failed'
                }
            }
        },
        async signup(username, email, password) {
            try {
                await axios.post('/api/auth/signup', { username, email, password })
                return { success: true }
            } catch (error) {
                return {
                    success: false,
                    message: error.response?.data?.msg || 'Signup failed'
                }
            }
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('currentUser')
        }
    }
})
