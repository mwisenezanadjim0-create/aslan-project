<template>
  <div class="glass-card">
    <h3>Inventory Management</h3>
    <div class="input-group">
      <input v-model="newItem" type="text" placeholder="Item Name (e.g. Flour, Sugar)">
      <input v-model="newQty" type="number" placeholder="Quantity">
    </div>
    <button @click="addStock" class="action-btn" :disabled="isLoading">
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-plus"></i> Add to Stock
    </button>
    
    <div style="margin-top: 30px;">
      <h4>Current Inventory</h4>
      <ul id="stockList">
        <li v-for="s in stock" :key="s._id">
          <span><strong>{{ s.item }}</strong> (Qty: {{ s.qty }})</span>
          <button @click="removeStock(s._id)" class="remove-btn"><i class="fas fa-trash"></i></button>
        </li>
        <li v-if="stock.length === 0" style="opacity:0.5; justify-content:center;">No items in stock</li>
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
const stock = ref([])
const newItem = ref('')
const newQty = ref('')
const isLoading = ref(false)

const fetchStock = async () => {
    try {
        const res = await axios.get('/api/dashboard/stock', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        stock.value = res.data
    } catch (err) {
        console.error("Failed to fetch stock:", err)
    }
}

const addStock = async () => {
    if (!newItem.value || !newQty.value) return
    isLoading.value = true
    try {
        await axios.post('/api/dashboard/stock', {
            item: newItem.value,
            qty: Number(newQty.value)
        }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        newItem.value = ''
        newQty.value = ''
        await fetchStock()
        notification.success(`Added ${newItem.value} to inventory`)
    } catch (err) {
        notification.error(err.response?.data?.msg || "Failed to add stock")
    } finally {
        isLoading.value = false
    }
}

const removeStock = async (id) => {
    try {
        await axios.delete(`/api/dashboard/stock/${id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        await fetchStock()
    } catch (err) {
        console.error("Failed to remove stock:", err)
    }
}

onMounted(fetchStock)
</script>
