<template>
  <div class="glass-card">
    <h3>Marketing Expenses</h3>
    <div class="input-group">
      <input v-model="mdate" type="date">
      <input v-model="cost" type="number" placeholder="Cost (RWF)">
    </div>
    <button @click="addMarketing" class="action-btn" :disabled="isLoading">
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-bullhorn"></i> Log Expense
    </button>
    
    <div style="margin-top: 30px;">
      <h4>Expense Logs</h4>
      <ul>
        <li v-for="m in marketing" :key="m._id">
            <span>{{ m.date }}</span> 
            <span style="color:var(--primary)">{{ Number(m.cost).toLocaleString() }} RWF</span>
        </li>
        <li v-if="marketing.length === 0" style="opacity:0.5; justify-content:center;">No marketing records</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notification'

const authStore = useAuthStore()
const notification = useNotificationStore()
const marketing = ref([])
const mdate = ref(new Date().toISOString().split('T')[0])
const cost = ref('')
const isLoading = ref(false)

const fetchMarketing = async () => {
    try {
        const res = await axios.get('/api/dashboard/marketing', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        marketing.value = res.data
    } catch (err) {
        console.error("Failed to fetch marketing:", err)
    }
}

const addMarketing = async () => {
    if (!mdate.value || !cost.value) return
    isLoading.value = true
    try {
        await axios.post('/api/dashboard/marketing', {
            date: mdate.value,
            cost: Number(cost.value)
        }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        cost.value = ''
        await fetchMarketing()
        notification.success("Marketing expense logged successfully")
    } catch (err) {
        notification.error(err.response?.data?.msg || "Failed to add marketing entry")
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchMarketing)
</script>
