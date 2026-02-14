<template>
  <div class="glass-card">
    <h3>Revenue Tracking</h3>
    <div class="input-group">
      <input v-model="date" type="date">
      <input v-model="amount" type="number" placeholder="Total Income (RWF)">
    </div>
    <button @click="submitDaily" class="action-btn" :disabled="isLoading">
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-save"></i> Save Transaction
    </button>
    
    <div style="margin-top: 40px; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px;">
      <h4 style="margin-bottom:15px; font-size:0.9rem; opacity:0.8;">Recent Revenue Trends</h4>
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div style="margin-top: 30px;">
      <h4>Transaction History</h4>
      <div style="max-height: 300px; overflow-y: auto; margin-top: 15px;">
        <table style="width: 100%; border-collapse: collapse; color: #fff;">
          <thead>
            <tr style="text-align: left; border-bottom: 2px solid rgba(255,255,255,0.1);">
              <th style="padding: 10px;">Date</th>
              <th style="padding: 10px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in reversedDaily" :key="d._id" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px; opacity: 0.8;">{{ d.date }}</td>
              <td style="padding: 10px; font-weight: 600;">{{ Number(d.amount).toLocaleString() }} RWF</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notification'

Chart.register(...registerables)

const authStore = useAuthStore()
const notification = useNotificationStore()
const dailyData = ref([])
const date = ref(new Date().toISOString().split('T')[0])
const amount = ref('')
const isLoading = ref(false)
const chartCanvas = ref(null)
let chartInstance = null

const reversedDaily = computed(() => [...dailyData.value].reverse())

const fetchDaily = async () => {
    try {
        const res = await axios.get('/api/dashboard/daily', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        dailyData.value = res.data
        updateChart()
    } catch (err) {
        console.error("Failed to fetch daily data:", err)
    }
}

const submitDaily = async () => {
    if (!date.value || !amount.value) return
    isLoading.value = true
    try {
        await axios.post('/api/dashboard/daily', {
            date: date.value,
            amount: Number(amount.value)
        }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        notification.success("Daily Progress saved and report sent!")
        amount.value = ''
        await fetchDaily()
    } catch (err) {
        notification.error(err.response?.data?.msg || "Failed to save transaction")
    } finally {
        isLoading.value = false
    }
}

const initChart = () => {
    if (!chartCanvas.value) return
    
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: dailyData.value.map(d => d.date),
          datasets: [{
            label: "Daily Income (RWF)",
            data: dailyData.value.map(d => d.amount),
            borderColor: "var(--primary)",
            backgroundColor: "rgba(0, 255, 221, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
            x: { grid: { display: false }, ticks: { color: '#fff' } }
          },
          plugins: { legend: { labels: { color: '#fff' } } }
        }
    })
}

const updateChart = () => {
    if (chartInstance) {
        chartInstance.data.labels = dailyData.value.map(d => d.date)
        chartInstance.data.datasets[0].data = dailyData.value.map(d => d.amount)
        chartInstance.update()
    } else {
        initChart()
    }
}

onMounted(() => {
    fetchDaily()
})
</script>
