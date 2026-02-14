<template>
  <div class="dashboard-page">
    <!-- BACKGROUND ANIMATIONS -->
    <section id="up"></section>
    <section id="down"></section>
    <section id="left"></section>
    <section id="right"></section>

    <div class="mobile-header">
      <div class="menu-btn" id="menuToggle" @click="isSidebarActive = !isSidebarActive">
        <i class="fas fa-bars"></i>
      </div>
      <div class="brand-mobile" style="font-family: 'Dancing Script'; font-size: 1.5rem;">Aslan</div>
      <div style="width: 24px;"></div>
    </div>

    <div class="layout">
      <!-- SIDEBAR OVERLAY -->
      <div v-if="isSidebarActive" class="sidebar-overlay" @click="isSidebarActive = false"></div>

      <!-- SIDEBAR -->
      <aside class="sidebar" :class="{ active: isSidebarActive }">
        <div class="sidebar-header" @click="$router.push('/')" style="cursor: pointer;">
          <img src="@/assets/img/2.png" alt="Logo" class="sidebar-logo">
          <div class="sidebar-brand-group">
            <h2 class="brand">Aslan</h2>
            <p class="brand-sub">Management</p>
          </div>
        </div>
        <nav class="sidebar-nav">
          <button 
            v-for="item in navItems" 
            :key="item.id"
            :class="{ active: currentSection === item.id }"
            @click="setSection(item.id)"
          >
            <i :class="item.icon"></i> {{ item.label }}
          </button>
          
          <button v-if="isAdmin" 
            :class="{ active: currentSection === 'staff' }"
            @click="setSection('staff')"
          >
            <i class="fas fa-users"></i> Staff Tracking
          </button>

          <button id="cardGenBtn" @click="$router.push('/card-generator')">
            <i class="fas fa-id-card"></i> Card Generator
          </button>
        </nav>
        <button @click="handleLogout" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="content">
        <header class="top-bar">
          <h1 id="welcome">
            Welcome back, <span style="color:var(--primary); font-weight:600;">{{ authStore.user?.username }}</span>
          </h1>
        </header>

        <div class="main-section">
          <!-- Dynamic Sections -->
          <component :is="activeComponent" @refresh="fetchUserRole" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import '@/assets/dashboard.css'

const router = useRouter()
const authStore = useAuthStore()

const isSidebarActive = ref(false)
const currentSection = ref('home')

const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'stock', label: 'Stock', icon: 'fas fa-box' },
    { id: 'daily', label: 'Daily Progress', icon: 'fas fa-chart-line' },
    { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-cart' },
    { id: 'marketing', label: 'Marketing', icon: 'fas fa-bullhorn' },
    { id: 'reviews', label: 'Guest Reviews', icon: 'fas fa-comments' }
]

const isAdmin = computed(() => {
    return authStore.user?.role === 'admin' || authStore.user?.role === 'boss'
})

// Async components for sections
const activeComponent = computed(() => {
    switch (currentSection.value) {
        case 'home': return defineAsyncComponent(() => import('./dashboard/DashboardHome.vue'))
        case 'stock': return defineAsyncComponent(() => import('./dashboard/DashboardStock.vue'))
        case 'daily': return defineAsyncComponent(() => import('./dashboard/DashboardDaily.vue'))
        case 'orders': return defineAsyncComponent(() => import('./dashboard/DashboardOrders.vue'))
        case 'marketing': return defineAsyncComponent(() => import('./dashboard/DashboardMarketing.vue'))
        case 'reviews': return defineAsyncComponent(() => import('./dashboard/DashboardReviews.vue'))
        case 'staff': return defineAsyncComponent(() => import('./dashboard/DashboardStaff.vue'))
        default: return null
    }
})

const setSection = (id) => {
    currentSection.value = id
    isSidebarActive.value = false
}

const handleLogout = () => {
    authStore.logout()
    router.push('/')
}

onMounted(async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
})
</script>

<style scoped>
.dashboard-page {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

.layout {
    height: 100vh;
}

.content {
    height: 100vh;
    overflow-y: auto;
}
.sidebar-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 30px;
}
.sidebar-logo {
    height: 50px;
    width: auto;
    filter: brightness(0) invert(1);
}
.sidebar-brand-group {
    display: flex;
    flex-direction: column;
}
</style>
