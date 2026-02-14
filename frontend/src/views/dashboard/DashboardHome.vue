<template>
  <div v-if="loading" class="loading">Loading Overview...</div>
  <div v-else>
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <h3 style="margin-bottom:20px;"><i class="fas fa-chart-pie"></i> Business Overview</h3>
          <div style="text-align:right;">
            <span v-if="isAdmin" class="badge" style="background:var(--primary); color:#000; padding:2px 10px; border-radius:12px; font-size:0.7rem; margin-top:5px; display:inline-block; font-weight:600;">
                {{ authStore.user?.role?.toUpperCase() }} ACCOUNT
            </span>
            <br>
            <span style="font-size:0.8rem; opacity:0.7;">{{ currentDate }}</span>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <h4>{{ !isAdmin ? 'My Stock Items' : 'Total Stock Items' }}</h4>
            <div class="stat-value">{{ summary.stockCount }}</div>
          </div>
          <div class="stat-item">
            <h4>{{ !isAdmin ? 'My Reports' : 'Total Staff Reports' }}</h4>
            <div class="stat-value">{{ summary.dailyCount }}</div>
          </div>
          <div class="stat-item">
            <h4>{{ !isAdmin ? 'My Expenses' : 'Total Expenses' }}</h4>
            <div class="stat-value">{{ summary.marketingCount }}</div>
          </div>
        </div>
      </div>

      <div class="glass-card" style="margin-top:20px;">
        <h3 style="margin-bottom:20px; color:var(--primary);"><i class="fas fa-coins"></i> Financial Performance</h3>
        
        <!-- Interactive Chart -->
        <div style="background: rgba(0,0,0,0.2); padding: 25px; border-radius: 20px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h4 style="font-size: 0.9rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Revenue Trend (Last 7 Reports)</h4>
                <i class="fas fa-chart-line" style="color: var(--primary); opacity: 0.5;"></i>
            </div>
            <div style="height: 300px; width: 100%;">
                <canvas ref="revenueChartCanvas"></canvas>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <div class="stat-item" style="border-left: 3px solid var(--primary);">
            <h4>Today <small style="font-size:0.6rem; display:block; opacity:0.5;">({{ summary.todayDate || 'Current Day' }})</small></h4>
            <div class="stat-value" style="font-size:1.4rem; color:var(--primary);">{{ Number(summary.stats?.today || 0).toLocaleString() }} <small>RWF</small></div>
          </div>
          <div class="stat-item">
            <h4>This Week</h4>
            <div class="stat-value" style="font-size:1.2rem; color:var(--primary);">{{ Number(summary.stats?.thisWeek || 0).toLocaleString() }} <small>RWF</small></div>
          </div>
          <div class="stat-item">
            <h4>This Month</h4>
            <div class="stat-value" style="font-size:1.2rem; color:var(--primary);">{{ Number(summary.stats?.thisMonth || 0).toLocaleString() }} <small>RWF</small></div>
          </div>
          <div class="stat-item">
            <h4>This Year</h4>
            <div class="stat-value" style="font-size:1.2rem; color:var(--primary);">{{ Number(summary.stats?.thisYear || 0).toLocaleString() }} <small>RWF</small></div>
          </div>
        </div>
        <div class="stat-item" style="margin-top:20px; text-align:center; border-top: 1px solid rgba(255,255,255,0.1); padding-top:20px;">
            <h4>{{ !isAdmin ? 'My Total Revenue' : 'Company Total Revenue' }}</h4>
            <div class="stat-value" style="font-weight:700; color:var(--primary); font-size:1.8rem;">{{ Number(summary.stats?.allTime || 0).toLocaleString() }} <small>RWF</small></div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const authStore = useAuthStore()
const loading = ref(true)
const summary = ref({})
const dailyHistory = ref([])
const revenueChartCanvas = ref(null)
let chartInstance = null

const isAdmin = computed(() => {
    return authStore.user?.role === 'admin' || authStore.user?.role === 'boss'
})

const currentDate = computed(() => {
    return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
})

const fetchSummary = async () => {
    try {
        const res = await axios.get('/api/dashboard/summary', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        summary.value = res.data
        
        // Also fetch daily history for the chart
        const dailyRes = await axios.get('/api/dashboard/daily', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        dailyHistory.value = dailyRes.data.slice(-7) // Get last 7 days
        
        await nextTick()
        initChart()
    } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
    } finally {
        loading.value = false
    }
}

const initChart = () => {
    if (!revenueChartCanvas.value) return
    
    if (chartInstance) chartInstance.destroy()

    const ctx = revenueChartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyHistory.value.map(d => d.date),
            datasets: [{
                label: 'Revenue (RWF)',
                data: dailyHistory.value.map(d => d.amount),
                borderColor: '#00f2ff',
                backgroundColor: (context) => {
                    const chart = context.chart
                    const {ctx, chartArea} = chart
                    if (!chartArea) return null
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
                    gradient.addColorStop(0, 'rgba(0, 242, 255, 0)')
                    gradient.addColorStop(1, 'rgba(0, 242, 255, 0.2)')
                    return gradient
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#00f2ff',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 10 } }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#00f2ff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(0, 242, 255, 0.2)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: (ctx) => `${ctx.raw.toLocaleString()} RWF`
                    }
                }
            }
        }
    })
}

onMounted(fetchSummary)
</script>
