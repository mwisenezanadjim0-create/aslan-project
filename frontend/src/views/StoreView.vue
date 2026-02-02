<template>
  <div class="store-page">
    <NavBar />

    <header class="store-hero">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
            <h1 class="dancing-script">Aslan Experiences</h1>
            <p>Give the gift of luxury dining or book a special night with your loved ones.</p>
        </div>
    </header>

    <nav class="category-nav-sticky">
        <div class="nav-container">
            <a href="#giftcards" class="cat-link" :class="{ active: activeSection === 'giftcards' }" @click="activeSection = 'giftcards'">Gift Cards</a>
            <a href="#events" class="cat-link" :class="{ active: activeSection === 'events' }" @click="activeSection = 'events'">Events & Nights</a>
            <a href="#classes" class="cat-link" :class="{ active: activeSection === 'classes' }" @click="activeSection = 'classes'">Masterclasses</a>
        </div>
    </nav>

    <main class="container store-main">
        <!-- 1. GIFT CARDS -->
        <section class="store-section" id="giftcards">
            <div class="section-intro">
                <h2>Digital Gift Cards</h2>
                <div class="header-divider"></div>
                <p>Perfect for any occasion. Valid for 6 months at all Aslan locations.</p>
            </div>
            
            <div class="product-grid">
                <div 
                  v-for="card in giftCards" 
                  :key="card.name" 
                  class="premium-store-card"
                >
                    <div class="card-visual">
                        <div class="ribbon">PREMIUM</div>
                        <i :class="card.icon"></i>
                        <span class="value-badge">{{ card.shortPrice }}</span>
                    </div>
                    <div class="card-info">
                        <h3>{{ card.name }}</h3>
                        <p class="desc" v-html="card.description"></p>
                        <div class="card-footer">
                            <span class="price">{{ card.price.toLocaleString() }} RWF</span>
                            <button class="purchase-btn" @click="handlePurchase(card)">
                                <i class="fas fa-shopping-cart"></i> Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 2. SPECIAL EVENTS -->
        <section class="store-section" id="events">
            <div class="section-intro">
                <h2>Bespoke Events</h2>
                <div class="header-divider"></div>
            </div>
            
            <div class="product-grid">
                <div 
                  v-for="event in events" 
                  :key="event.name" 
                  class="premium-store-card event-card"
                >
                    <div class="card-image">
                        <img :src="event.image" :alt="event.name">
                    </div>
                    <div class="card-info">
                        <h3>{{ event.name }}</h3>
                        <p class="desc">{{ event.description }}</p>
                        <div class="card-footer">
                            <span class="price">{{ event.price.toLocaleString() }} RWF</span>
                            <button class="purchase-btn" @click="handlePurchase(event)">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 3. MASTERCLASSES -->
        <section class="store-section" id="classes">
            <div class="section-intro">
                <h2>Masterclasses</h2>
                <div class="header-divider"></div>
            </div>
            
            <div class="product-grid">
                <div 
                  v-for="cls in classes" 
                  :key="cls.name" 
                  class="premium-store-card event-card"
                >
                    <div class="card-image">
                        <img :src="cls.image" :alt="cls.name">
                    </div>
                    <div class="card-info">
                        <h3>{{ cls.name }}</h3>
                        <p class="desc">{{ cls.description }}</p>
                        <div class="card-footer">
                            <span class="price">{{ cls.price.toLocaleString() }} RWF</span>
                            <button class="purchase-btn" @click="handlePurchase(cls)">
                                Reserve Spot
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const activeSection = ref('giftcards')

const giftCards = [
    { name: 'Bronze Gift Card', price: 10000, shortPrice: '10k', icon: 'fas fa-gift', description: '<strong>Good for:</strong> Vegetarian Pizza, Beef Steak, or King Burger + Drink.' },
    { name: 'Silver Gift Card', price: 25000, shortPrice: '25k', icon: 'fas fa-gem', description: '<strong>Good for:</strong> Full Chicken & Chips, Big Grilled Fish, or 2x Pizzas.' },
    { name: 'Gold VIP Gift Card', price: 50000, shortPrice: '50k', icon: 'fas fa-crown', description: '<strong>Good for:</strong> Aslan Master Plate (Fish/Chicken), Family Platters, or Full 3-Course Dinner.' }
]

const events = [
    { 
        name: "Couple's Dinner Night", 
        price: 40000, 
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80',
        description: 'A romantic 3-course meal for two. Includes decorative table setting & wine/juice.'
    },
    { 
        name: 'Family Sunday Feast', 
        price: 60000, 
        image: 'https://images.unsplash.com/photo-1547928576-a4a33237bec3?auto=format&fit=crop&w=500&q=80',
        description: 'A massive platter for 4-5 people. Grilled meats, sides, and drinks included.'
    },
    { 
        name: 'Birthday Party Package', 
        price: 100000, 
        image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=500&q=80',
        description: 'Complete Celebration for 8-10 people. Includes Cake, Decorations, & Food Platter.'
    }
]

const classes = [
    { 
        name: 'Barista Masterclass', 
        price: 15000, 
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80',
        description: 'Learn to brew the perfect cup. 2-hour session with our head barista.'
    },
    { 
        name: 'Grill Masterclass', 
        price: 20000, 
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
        description: "Learn the secrets of the 'Fish Master Plate' from our top chefs."
    }
]

const handlePurchase = (item) => {
    localStorage.setItem('orderName', item.name)
    localStorage.setItem('orderPrice', item.price)
    router.push('/payment')
}
</script>

<style scoped>
.store-page {
    min-height: 100vh;
}

.store-hero {
    height: 50vh;
    min-height: 400px;
    background: url('https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1500&q=80') center/cover;
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
    background: radial-gradient(circle at center, rgba(11, 15, 26, 0.7) 0%, rgba(11, 15, 26, 0.95) 100%);
}

.hero-content {
    position: relative;
    z-index: 10;
}

.hero-content h1 {
    font-size: 5rem;
    color: var(--primary);
    margin-bottom: 15px;
}

.hero-content p {
    font-size: 1.25rem;
    color: var(--text-dim);
    max-width: 600px;
}

.category-nav-sticky {
    position: sticky;
    top: 80px;
    z-index: 900;
    background: rgba(11, 15, 26, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    padding: 15px 0;
}

.nav-container {
    display: flex;
    justify-content: center;
    gap: 30px;
}

.cat-link {
    color: var(--text-dim);
    text-decoration: none;
    font-weight: 700;
    padding: 10px 25px;
    border-radius: 50px;
    transition: 0.3s;
    font-size: 0.95rem;
}

.cat-link:hover, .cat-link.active {
    background: var(--primary);
    color: var(--dark-bg);
}

.store-main {
    padding: 80px 5%;
    max-width: 1400px;
}

.store-section {
    margin-bottom: 120px;
    scroll-margin-top: 180px;
}

.section-intro {
    text-align: center;
    margin-bottom: 60px;
}

.section-intro h2 {
    font-size: 3rem;
    color: #fff;
}

.header-divider {
    width: 60px;
    height: 3px;
    background: var(--primary);
    margin: 20px auto;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 40px;
}

.premium-store-card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 30px;
    overflow: hidden;
    transition: 0.4s;
    display: flex;
    flex-direction: column;
}

.premium-store-card:hover {
    transform: translateY(-10px);
    border-color: var(--primary);
}

.card-visual {
    height: 250px;
    background: linear-gradient(135deg, rgba(5, 124, 172, 0.2), rgba(0, 255, 221, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.ribbon {
    position: absolute;
    top: 20px;
    right: -35px;
    background: var(--primary);
    color: var(--dark-bg);
    padding: 5px 45px;
    transform: rotate(45deg);
    font-weight: 900;
    font-size: 0.75rem;
}

.card-visual i {
    font-size: 6rem;
    color: var(--primary);
    filter: drop-shadow(0 10px 20px rgba(0, 255, 221, 0.3));
}

.value-badge {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 8px 18px;
    border-radius: 50px;
    font-weight: 800;
    color: var(--primary);
    border: 1px solid var(--glass-border);
}

.card-image {
    height: 250px;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-info {
    padding: 30px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-info h3 {
    font-size: 1.6rem;
    margin-bottom: 15px;
}

.desc {
    color: var(--text-dim);
    line-height: 1.6;
    margin-bottom: 30px;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--primary);
}

.purchase-btn {
    background: var(--primary);
    color: var(--dark-bg);
    border: none;
    padding: 12px 25px;
    border-radius: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: 0.3s;
}

.purchase-btn:hover {
    background: #fff;
    transform: scale(1.05);
}

@media (max-width: 600px) {
    .store-hero h1 { font-size: 3rem; }
    .product-grid { grid-template-columns: 1fr; }
    .nav-container { gap: 10px; }
    .cat-link { padding: 8px 15px; font-size: 0.8rem; }
}
</style>
