<template>
  <div class="menu-page">
    <NavBar />

    <!-- Hero Section: More compact and focused -->
    <header class="menu-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content hero-main-content">
        <h1 class="dancing-script">Our Exquisite Menu</h1>
        <p>Hand-crafted flavors for the modern palate.</p>
        
        <!-- Live Search Bar -->
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search for your favorite dish..."
            class="search-input"
          />
        </div>
      </div>
    </header>

    <!-- Sticky Category Bar: Better for navigation -->
    <div class="category-bar-wrapper">
      <nav class="category-bar">
        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          class="cat-btn" 
          :class="{ active: currentCategory === cat.id }"
          @click="currentCategory = cat.id"
        >
          <i v-if="cat.icon" :class="cat.icon"></i>
          <span>{{ cat.label }}</span>
        </button>
      </nav>
    </div>

    <main class="menu-container menu-main-content">
      <!-- Section Layout -->
      <div v-for="section in filteredMenu" :key="section.category" class="menu-section">
        <div class="section-title-wrapper">
            <h3 class="section-title">{{ section.title }}</h3>
            <div class="title-accent"></div>
        </div>
        
        <div class="menu-items-grid">
          <div 
            v-for="item in section.items" 
            :key="item.id" 
            class="menu-item-card"
            :class="{ 'chef-choice-card': item.chefSpecial }"
          >
            <div v-if="item.chefSpecial" class="chef-badge">
              <i class="fas fa-crown"></i> Chef's Choice
            </div>
            
            <div class="card-inner">
              <div class="item-main-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-desc">{{ item.description }}</p>
              </div>
              
              <div class="item-meta">
                <div class="item-price">
                  <span class="currency">RWF</span>
                  <span class="price-val">{{ Number(item.price).toLocaleString() }}</span>
                </div>
                <button class="order-action-btn" @click="handleOrder(item)">
                  Add to Cart <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredMenu.length === 0" class="empty-menu">
        <div class="empty-icon">🍽️</div>
        <h3>No items found</h3>
        <p>Try searching for something else or adjusting your filters.</p>
        <button @click="resetFilters" class="reset-btn">View All Menu</button>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { menuItems } from '@/data/menuItems'

const router = useRouter()
const cartStore = useCartStore()
const currentCategory = ref('all')
const searchQuery = ref('')

const categories = [
  { id: 'all', label: 'All', icon: 'fas fa-utensils' },
  { id: 'breakfast', label: 'Breakfast', icon: 'fas fa-coffee' },
  { id: 'snacks', label: 'Snacks', icon: 'fas fa-cookie' },
  { id: 'starter', label: 'Starters', icon: 'fas fa-leaf' },
  { id: 'soup', label: 'Soups', icon: 'fas fa-bowl-hot' },
  { id: 'main', label: 'Main', icon: 'fas fa-hamburger' },
  { id: 'drinks', label: 'Drinks', icon: 'fas fa-glass-martini-alt' }
]

const titleMap = {
  'breakfast': 'Sunrise Breakfast',
  'snacks': 'Quick Bites',
  'starter': 'Fresh Starters',
  'soup': 'Hearty Soups',
  'main': 'Signature Dishes',
  'drinks': 'Chilled Beverages'
}

const filteredMenu = computed(() => {
  let items = menuItems
  
  if (currentCategory.value !== 'all') {
    items = items.filter(item => item.category === currentCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    )
  }

  const sections = {}
  items.forEach(item => {
    if (!sections[item.category]) {
      sections[item.category] = {
        category: item.category,
        title: titleMap[item.category] || item.category.toUpperCase(),
        items: []
      }
    }
    sections[item.category].items.push(item)
  })

  const categoryOrder = ['breakfast', 'snacks', 'starter', 'soup', 'main', 'sides', 'drinks']
  return categoryOrder
    .filter(cat => sections[cat])
    .map(cat => sections[cat])
})

const handleOrder = (item) => {
  cartStore.addItem(item)
  cartStore.isCartOpen = true
}

const resetFilters = () => {
  currentCategory.value = 'all'
  searchQuery.value = ''
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.menu-page {
    min-height: 100vh;
    background: #0b0f1a;
}

/* HERO SECTION */
.menu-hero {
    height: 48vh;
    min-height: 400px;
    background: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80') center/cover;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 80px;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(11, 15, 26, 0.7), rgba(11, 15, 26, 0.95));
}

.hero-main-content {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding: 0 5%;
    position: relative;
    z-index: 10;
}

.hero-content h1 {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    color: var(--primary);
    margin-bottom: 10px;
    text-shadow: 0 10px 30px rgba(0, 255, 221, 0.3);
}

.hero-content p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 40px;
}

/* SEARCH BAR */
.search-container {
    max-width: 600px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    padding: 5px 25px;
    display: flex;
    align-items: center;
    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.search-container:focus-within {
    background: rgba(255, 255, 255, 0.12);
    border-color: var(--primary);
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 255, 221, 0.2);
}

.search-icon {
    color: var(--primary);
    font-size: 1.2rem;
    margin-right: 15px;
}

.search-input {
    background: none;
    border: none;
    color: #fff;
    width: 100%;
    padding: 15px 0;
    font-size: 1rem;
    outline: none;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

/* STICKY CATEGORY BAR */
.category-bar-wrapper {
    position: sticky;
    top: 75px;
    z-index: 90;
    background: rgba(11, 15, 26, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.category-bar {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 15px 5%;
    flex-wrap: wrap;
}

.cat-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 22px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.3s;
}

.cat-btn:hover {
    background: rgba(0, 255, 221, 0.1);
    border-color: var(--primary);
    color: #fff;
}

.cat-btn.active {
    background: var(--primary);
    color: #0b111e;
    box-shadow: 0 10px 20px rgba(0, 255, 221, 0.3);
}

/* MENU CONTENT */
.menu-container {
    padding: 80px 0 120px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

.menu-main-content {
    padding-left: 5%;
    padding-right: 5%;
}

.menu-section {
    margin-bottom: 80px;
}

.section-title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
}

.section-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 10px;
}

.title-accent {
    width: 80px;
    height: 4px;
    background: var(--primary);
    border-radius: 2px;
}

/* CARDS GRID */
.menu-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
}

.menu-item-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
}

.chef-choice-card {
    border: 1px solid rgba(0, 255, 221, 0.2);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(0, 255, 221, 0.01));
}

.menu-item-card:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.04);
    border-color: var(--primary);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
}

.chef-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--primary);
    color: #0b111e;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 8px 18px;
    border-bottom-left-radius: 20px;
}

.card-inner {
    padding: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.item-name {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 12px;
}

.item-desc {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.95rem;
    line-height: 1.6;
}

.item-meta {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price-val {
    font-size: 1.5rem;
    font-weight: 800;
}

.order-action-btn {
    background: transparent;
    border: 1.5px solid var(--primary);
    color: var(--primary);
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
}

.order-action-btn:hover {
    background: var(--primary);
    color: #0b111e;
}

@media (max-width: 768px) {
    .menu-main-content { padding-left: 20px; padding-right: 20px; }
    .section-title { font-size: 1.8rem; }
    .menu-items-grid { grid-template-columns: 1fr; }
    .item-meta { flex-direction: column; gap: 15px; text-align: center; }
    .order-action-btn { width: 100%; }
}
</style>
