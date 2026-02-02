<template>
  <div v-if="loading" class="loading">Fetching staff records...</div>
  <div v-else class="glass-card">
    <h3><i class="fas fa-users"></i> Staff Performance Tracking</h3>
    <p style="opacity:0.7; margin-bottom:25px;">Monitoring activities for all registered users.</p>
    
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
      <div v-for="s in staffData" :key="s._id" class="stat-item" style="background: rgba(255,255,255,0.05); padding:20px; text-align:left; border: 1px solid rgba(0,255,221,0.1);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="margin:0; color:#00ffdd;">{{ s.username }}</h4>
          <span style="font-size:0.7rem; background:rgba(0,255,221,0.2); padding:2px 8px; border-radius:10px;">{{ (s.role || 'staff').toUpperCase() }}</span>
        </div>
        <p style="font-size:0.8rem; opacity:0.6; margin: 10px 0;">{{ s.email }}</p>
        
        <div style="display:flex; gap:15px; margin-top:15px;">
          <div style="flex:1;">
            <small style="opacity:0.5; display:block;">Orders Sent</small>
            <strong style="font-size:1.1rem;">{{ s.stats?.orders || 0 }}</strong>
          </div>
          <div style="flex:1;">
            <small style="opacity:0.5; display:block;">Reports Filed</small>
            <strong style="font-size:1.1rem;">{{ s.stats?.reports || 0 }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const staffData = ref([])
const loading = ref(true)

const fetchStaff = async () => {
    try {
        const res = await axios.get('/api/dashboard/staff', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        staffData.value = res.data
    } catch (err) {
        console.error("Failed to fetch staff data:", err)
    } finally {
        loading.value = false
    }
}

onMounted(fetchStaff)
</script>
