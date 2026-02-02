import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ProductView from '../views/ProductView.vue'
import PaymentView from '../views/PaymentView.vue'
import DashboardView from '../views/DashboardView.vue'
import CardGeneratorView from '../views/CardGeneratorView.vue'
import StoreView from '../views/StoreView.vue'
import RestaurantView from '../views/RestaurantView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignupView
        },
        {
            path: '/product',
            name: 'product',
            component: ProductView
        },
        {
            path: '/payment',
            name: 'payment',
            component: PaymentView
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
            meta: { requiresAuth: true }
        },
        {
            path: '/card-generator',
            name: 'card-generator',
            component: CardGeneratorView,
            meta: { requiresAuth: true }
        },
        {
            path: '/store',
            name: 'store',
            component: StoreView
        },
        {
            path: '/restaurant',
            name: 'restaurant',
            component: RestaurantView
        },
        // Catch-all route
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (to.hash) {
                return { el: to.hash, behavior: 'smooth' }
            }
            return { top: 0, behavior: 'smooth' }
        }
    }
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthenticated = authStore.isAuthenticated || !!localStorage.getItem('token')

    if (requiresAuth && !isAuthenticated) {
        console.warn("Unauthorized access attempt. Redirecting to login.")
        next('/login')
    } else if ((to.path === '/login' || to.path === '/signup') && isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
