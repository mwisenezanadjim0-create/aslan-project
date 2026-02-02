<template>
  <div class="menu-page">
    <NavBar />

    <!-- Hero Section: More compact and focused -->
    <header class="menu-hero">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1 class="dancing-script">Our Exquisite Menu</h1>
        <p>Hand-crafted flavors for the modern palate.</p>
      </div>
    </header>

    <!-- Sticky Category Bar: Better for navigation -->
    <div class="category-bar-wrapper">
      <nav class="container category-bar">
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

    <main class="container menu-container">
      <!-- Section Layout: Two-column grid for menu sections on large screens -->
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
                  Order <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredMenu.length === 0" class="empty-menu">
        <div class="empty-icon">🍽️</div>
        <h3>No items found</h3>
        <p>Try switching to another category.</p>
        <button @click="currentCategory = 'all'" class="reset-btn">View All Menu</button>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { menuItems } from '@/data/menuItems'

const router = useRouter()
const currentCategory = ref('all')

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
    items = menuItems.filter(item => item.category === currentCategory.value)
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
  localStorage.setItem('orderName', item.name)
  localStorage.setItem('orderPrice', item.price)
  router.push('/payment')
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
    height: 40vh;
    min-height: 300px;
    background: url('https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1500&q=80') center/cover;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 60px;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(11, 15, 26, 0.8), rgba(11, 15, 26, 0.95));
}

.hero-content {
    position: relative;
    z-index: 10;
}

.hero-content h1 {
    font-size: 4rem;
    color: var(--primary);
    margin-bottom: 10px;
    text-shadow: 0 10px 30px rgba(0, 255, 221, 0.3);
}

.hero-content p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 2px;
    text-transform: uppercase;
}

/* STICKY CATEGORY BAR */
.category-bar-wrapper {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(11, 15, 26, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.category-bar {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 15px 0;
    overflow-x: auto;
    scrollbar-width: none; /* Hide scrollbar for clean look */
}

.category-bar::-webkit-scrollbar { display: none; }

.cat-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cat-btn i { color: var(--primary); font-size: 0.9rem; }

.cat-btn:hover {
    background: rgba(0, 255, 221, 0.1);
    border-color: var(--primary);
    color: #fff;
}

.cat-btn.active {
    background: var(--primary);
    color: #0b0f1a;
    border-color: var(--primary);
    box-shadow: 0 10px 25px rgba(0, 255, 221, 0.3);
}

.cat-btn.active i { color: #0b0f1a; }

/* MENU CONTENT */
.menu-container {
    padding: 60px 0 100px;
    max-width: 1200px;
}

.menu-section {
    margin-bottom: 80px;
}

.section-title-wrapper {
    margin-bottom: 40px;
    position: relative;
}

.section-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 10px;
}

.title-accent {
    width: 60px;
    height: 4px;
    background: var(--primary);
    border-radius: 2px;
}

/* CARDS GRID */
.menu-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 25px;
}

.menu-item-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
}

.menu-item-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--primary);
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.chef-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--primary);
    color: #0b0f1a;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 6px 15px;
    border-bottom-left-radius: 20px;
    text-transform: uppercase;
}

.card-inner {
    padding: 30px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
}

.item-name {
    font-size: 1.35rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
}

.item-desc {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 0;
}

.item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 20px;
    margin-top: auto;
}

.currency {
    display: block;
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: -4px;
}

.price-val {
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
}

.order-action-btn {
    background: transparent;
    border: 1.5px solid var(--primary);
    color: var(--primary);
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.order-action-btn:hover {
    background: var(--primary);
    color: #0b0f1a;
}

/* EMPTY STATE */
.empty-menu {
    text-align: center;
    padding: 80px 0;
}

.empty-icon { font-size: 4rem; margin-bottom: 20px; }

.reset-btn {
    background: var(--primary);
    border: none;
    color: #0b0f1a;
    padding: 12px 30px;
    border-radius: 50px;
    font-weight: 700;
    margin-top: 25px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .menu-hero {
        height: 35vh;
        min-height: 250px;
        padding-top: 70px;
    }

    .hero-content h1 { 
        font-size: 2.2rem; 
        margin-bottom: 8px;
    }
    
    .hero-content p {
        font-size: 0.75rem;
        letter-spacing: 1px;
    }

    .category-bar-wrapper {
        position: sticky;
        top: 0;
    }

    .category-bar { 
        justify-content: flex-start; 
        padding: 12px 15px;
        gap: 8px;
    }

    .cat-btn {
        padding: 8px 14px;
        font-size: 0.8rem;
        gap: 6px;
    }

    .cat-btn i {
        font-size: 0.8rem;
    }

    .menu-container {
        padding: 40px 0 80px;
    }

    .menu-section {
        margin-bottom: 50px;
    }

    .section-title {
        font-size: 1.5rem;
        word-break: break-word;
    }

    .menu-items-grid { 
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .menu-item-card {
        margin-bottom: 10px;
    }

    .card-inner {
        padding: 20px;
        gap: 15px;
    }

    .item-name {
        font-size: 1.2rem;
        margin-bottom: 8px;
    }

    .item-desc {
        font-size: 0.85rem;
        line-height: 1.5;
    }

    .item-meta {
        padding-top: 15px;
        gap: 10px;
        flex-wrap: wrap;
    }

    .price-val {
        font-size: 1.3rem;
    }

    .order-action-btn {
        padding: 10px 18px;
        font-size: 0.85rem;
        white-space: nowrap;
    }
}

@media (max-width: 480px) {
    .hero-content h1 { 
        font-size: 1.8rem;
    }

    .section-title {
        font-size: 1.4rem;
    }

    .cat-btn {
        padding: 7px 12px;
        font-size: 0.75rem;
    }
}
</style>
