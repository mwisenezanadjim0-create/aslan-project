<template>
  <div class="glass-card">
    <h3>Order Management</h3>
    <div class="input-group">
      <input v-model="form.date" type="date">
      <input v-model="form.foodType" type="text" placeholder="Food Name (e.g. Big Burger)">
    </div>
    <div class="input-group">
      <input v-model="form.amount" type="number" placeholder="Amount (RWF)">
      <select v-model="form.orderType">
        <option value="">Order Type</option>
        <option value="delivery">Delivery</option>
        <option value="dropup">Dropup</option>
        <option value="pickup">Pickup</option>
        <option value="dine-in">Dine-in</option>
      </select>
    </div>
    <div class="input-group">
      <select v-model="form.paymentType">
        <option value="">Select Payment</option>
        <option value="momo">Momo</option>
        <option value="cash">Cash</option>
      </select>
      <button @click="submitOrder" class="action-btn" :disabled="isLoading">
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-paper-plane"></i> Submit Order
      </button>
    </div>
    
    <div style="margin-top: 30px;">
      <h4>Recent Orders</h4>
      <ul id="orderList">
        <li v-for="o in reversedOrders" :key="o._id">
            <div style="display:flex; flex-direction:column; gap:5px; width:100%;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>{{ o.foodType }}</strong> <small style="opacity:0.7">({{ o.orderType }})</small></span>
                <span style="color:var(--primary); font-weight:600;">{{ Number(o.amount).toLocaleString() }} RWF</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.8rem; opacity:0.6;">{{ o.date }}</span>
                <span class="badge" style="background: rgba(0,255,221,0.2); padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">{{ o.paymentType?.toUpperCase() }}</span>
              </div>
            </div>
        </li>
        <li v-if="orders.length === 0" style="opacity:0.5; justify-content:center;">No orders registered</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notification'

const authStore = useAuthStore()
const notification = useNotificationStore()
const orders = ref([])
const isLoading = ref(false)

const form = reactive({
    date: new Date().toISOString().split('T')[0],
    foodType: '',
    amount: '',
    orderType: '',
    paymentType: ''
})

const reversedOrders = computed(() => [...orders.value].reverse())

const fetchOrders = async () => {
    try {
        const res = await axios.get('/api/dashboard/orders', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        orders.value = res.data
    } catch (err) {
        console.error("Failed to fetch orders:", err)
    }
}

const submitOrder = async () => {
    if (!form.date || !form.foodType || !form.amount || !form.orderType || !form.paymentType) {
        notification.error("All fields are required")
        return
    }

    isLoading.value = true
    try {
        await axios.post('/api/dashboard/orders', {
            ...form,
            amount: Number(form.amount)
        }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        notification.success("Success! Order saved and report sent.")
        
        // Reset form except date
        form.foodType = ''
        form.amount = ''
        form.orderType = ''
        form.paymentType = ''
        
        await fetchOrders()
    } catch (err) {
        notification.error(err.response?.data?.msg || "Failed to save order")
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchOrders)
</script>
