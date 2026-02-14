<template>
  <div class="menu-management">
    <div class="glass-card header-flex">
      <div>
        <h3><i class="fas fa-utensils"></i> Menu Management</h3>
        <p class="subtitle">Add, edit, or remove items from the public menu.</p>
      </div>
      <button class="btn-add" @click="openModal()">
        <i class="fas fa-plus"></i> Add New Item
      </button> 
    </div>

    <!-- Category Filter -->
    <div class="filter-bar">
      <button 
        v-for="cat in categories" 
        :key="cat" 
        class="filter-btn"
        :class="{ active: activeFilter === cat }"
        @click="activeFilter = cat"
      >
        {{ cat.toUpperCase() }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading menu...</p>
    </div>

    <div v-else class="menu-grid">
      <div 
        v-for="item in filteredItems" 
        :key="item._id" 
        class="menu-item-card"
        v-motion-slide-visible-bottom
      >
        <div class="item-header">
          <div class="category-tag">{{ item.category }}</div>
          <div v-if="item.chefSpecial" class="special-tag"><i class="fas fa-crown"></i></div>
        </div>
        <div class="item-body">
          <h4>{{ item.name }}</h4>
          <p class="price">{{ Number(item.price).toLocaleString() }} RWF</p>
          <p class="description">{{ item.description }}</p>
        </div>
        <div class="item-actions">
          <button class="action-btn edit" @click="openModal(item)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" @click="confirmDelete(item)">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content glass-card" v-motion-pop>
        <div class="modal-header">
          <h4>{{ editingItem ? 'Edit Menu Item' : 'Add New Menu Item' }}</h4>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveItem" class="menu-form">
          <div class="form-group">
            <label>Item Name</label>
            <input v-model="form.name" type="text" placeholder="e.g., Grilled Salmon" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select v-model="form.category" required>
                <option v-for="cat in rawCategories" :key="cat" :value="cat">
                  {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Price (RWF)</label>
              <input v-model="form.price" type="number" placeholder="5000" required>
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" placeholder="Briefly describe the dish..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Icon (FontAwesome)</label>
              <input v-model="form.icon" type="text" placeholder="fa-utensils">
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="chefSpecial" v-model="form.chefSpecial">
              <label for="chefSpecial">Chef's Special</label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'Saving...' : (editingItem ? 'Update Item' : 'Create Item') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const items = ref([])
const loading = ref(true)
const activeFilter = ref('all')
const showModal = ref(false)
const editingItem = ref(null)
const saving = ref(false)

const rawCategories = ['breakfast', 'snacks', 'starter', 'soup', 'main', 'sides', 'drinks']
const categories = ['all', ...rawCategories]

const form = ref({
  name: '',
  category: 'main',
  price: '',
  description: '',
  icon: 'fa-utensils',
  chefSpecial: false
})

const fetchItems = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/products')
    items.value = res.data
  } catch (err) {
    console.error('Failed to fetch items:', err)
  } finally {
    loading.value = false
  }
}

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return items.value
  return items.value.filter(i => i.category === activeFilter.value)
})

const openModal = (item = null) => {
  if (item) {
    editingItem.value = item
    form.value = { ...item }
  } else {
    editingItem.value = null
    form.value = {
      name: '',
      category: 'main',
      price: '',
      description: '',
      icon: 'fa-utensils',
      chefSpecial: false
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
}

const saveItem = async () => {
  saving.value = true
  try {
    const config = {
      headers: { Authorization: `Bearer ${authStore.token}` }
    }

    if (editingItem.value) {
      await axios.put(`/api/products/${editingItem.value._id}`, form.value, config)
    } else {
      await axios.post('/api/products', form.value, config)
    }
    
    await fetchItems()
    closeModal()
  } catch (err) {
    alert(err.response?.data?.msg || 'Error saving item')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (item) => {
  if (!confirm(`Are you sure you want to remove ${item.name}?`)) return
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${authStore.token}` }
    }
    await axios.delete(`/api/products/${item._id}`, config)
    await fetchItems()
  } catch (err) {
    alert('Error deleting item')
  }
}

onMounted(fetchItems)
</script>

<style scoped>
.menu-management {
  padding: 10px;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  margin-bottom: 30px;
}

.subtitle {
  color: var(--text-dim);
  font-size: 0.9rem;
  margin-top: 5px;
}

.btn-add {
  background: var(--primary);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px var(--primary-glow);
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-dim);
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.3s;
}

.filter-btn.active {
  background: var(--primary);
  color: #000;
  border-color: var(--primary);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.menu-item-card {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 20px;
  transition: 0.3s;
}

.menu-item-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.category-tag {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  color: var(--primary);
}

.special-tag {
  color: var(--accent);
  font-size: 0.9rem;
}

.item-body h4 {
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.price {
  color: var(--primary);
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 10px;
}

.description {
  font-size: 0.85rem;
  color: var(--text-dim);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transition: 0.3s;
}

.action-btn.edit:hover { background: var(--primary); color: #000; }
.action-btn.delete:hover { background: #ef4444; color: #fff; }

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 550px;
  padding: 40px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-dim);
  cursor: pointer;
}

.menu-form .form-group {
  margin-bottom: 20px;
}

.menu-form label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-dim);
}

.menu-form input, 
.menu-form select, 
.menu-form textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 12px 16px;
  border-radius: 12px;
  color: #fff;
  outline: none;
}

.menu-form textarea {
  height: 100px;
  resize: none;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 35px;
}

.checkbox-group input {
  width: 20px;
  height: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 40px;
}

.btn-cancel {
  background: none;
  border: 1px solid var(--glass-border);
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
}

.btn-save {
  background: var(--primary);
  color: #000;
  border: none;
  padding: 12px 30px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.loading-state {
  text-align: center;
  padding: 100px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .header-flex { flex-direction: column; text-align: center; gap: 20px; }
  .form-row { grid-template-columns: 1fr; }
  .checkbox-group { padding-top: 0; }
}
</style>
