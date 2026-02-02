<template>
  <div class="restaurant-page">
    <NavBar />

    <header class="resto-hero" :style="{ backgroundImage: `linear-gradient(rgba(11, 15, 26, 0.7), rgba(11, 15, 26, 0.9)), url(${frontViewImg})` }">
        <div class="container hero-content">
            <RouterLink to="/" class="back-home-mini">
                <i class="fas fa-arrow-left"></i> Back to Home
            </RouterLink>
            <span class="badge">GIKONDO, KK 565 ST</span>
            <h1 class="dancing-script">Aslan Luxe Resto</h1>
            <p>Premium Dining in the heart of Gikondo. Experience elegance and flavor in every bite.</p>
            <div class="hero-actions">
                <a href="tel:250785975691" class="btn-primary">
                    <i class="fas fa-calendar-check"></i> Book a Table
                </a>
                <a href="https://wa.me/250785975691" class="btn-outline">
                    <i class="fab fa-whatsapp"></i> Chat with Us
                </a>
            </div>
        </div>
    </header>

    <section class="gallery-section">
        <div class="container">
            <div class="section-header">
                <h2 class="dancing-script">Our Sanctuary</h2>
                <div class="header-divider"></div>
                <p>An interior designed for comfort, luxury, and unforgettable memories.</p>
            </div>

            <div class="gallery-grid">
                <div v-for="(item, index) in gallery" :key="index" class="gallery-item card-premium">
                    <img :src="item.img" :alt="item.alt">
                    <div class="gallery-overlay">
                        <span class="caption">{{ item.caption }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="highlights-section">
        <div class="container">
            <div class="section-header">
                <h2>Our Famous Signatures</h2>
                <div class="header-divider"></div>
            </div>

            <div class="menu-highlights-grid">
                <div v-for="(dish, index) in highlights" :key="index" class="highlight-card card-premium">
                    <div class="highlight-price">{{ dish.price }}</div>
                    <h3>{{ dish.name }}</h3>
                    <p>{{ dish.desc }}</p>
                    <button class="try-btn" @click="handleOrder(dish)">Order Now <i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </section>

    <section class="map-section">
        <div class="container">
            <div class="location-card card-premium">
                <div class="location-info">
                   <div class="icon-box"><i class="fas fa-map-marker-alt"></i></div>
                   <h3>Find Us Here</h3>
                   <p>Located at KK 565 St, Gikondo. Our doors are open for breakfast, lunch, and dinner. Come experience the Aslan hospitality.</p>
                   <div class="hours">
                       <div class="hour-item"><span>Monday - Friday:</span> <span>07:00 - 23:00</span></div>
                       <div class="hour-item"><span>Saturday - Sunday:</span> <span>08:00 - 00:00</span></div>
                   </div>
                </div>
            </div>
        </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

// Import images
import frontViewImg from '@/assets/img/front_view.jpg'
import resto1 from '@/assets/img/resto1.jpg'
import resto2 from '@/assets/img/resto2.jpg'
import resto3 from '@/assets/img/resto3.jpg'
import signboard from '@/assets/img/signboard.jpg'

const router = useRouter()

const gallery = [
    { img: frontViewImg, alt: 'Aslan Front View', caption: 'Elegant Entryway' },
    { img: resto2, alt: 'Interior View', caption: 'Main Dining Hall' },
    { img: resto3, alt: 'Lounge Area', caption: 'Private Lounge' },
    { img: resto1, alt: 'Interior Seating', caption: 'Artistic Lighting' },
    { img: signboard, alt: 'Aslan Sign', caption: 'The Brand of Gikondo' }
]

const highlights = [
    { name: 'Fish Master Plate', price: '12,000 RWF', rawPrice: 12000, desc: 'Freshly caught tilapia grilled with local herbs and served with seasoned chips.' },
    { name: 'BBQ Chicken Pizza', price: '10,000 RWF', rawPrice: 10000, desc: 'Wood-fired crust topped with smoky BBQ chicken, onions, and premium mozzarella.' },
    { name: 'Meat Deluxe Pizza', price: '8,500 RWF', rawPrice: 8500, desc: 'A carnivore\'s dream: Pepperoni, beef, and sausage on our signature crust.' },
    { name: 'Duo Platter', price: '15,000 RWF', rawPrice: 15000, desc: 'Perfect for sharing. A combination of our best brochettes and grilled sides.' }
]

const handleOrder = (dish) => {
    localStorage.setItem('orderName', dish.name)
    localStorage.setItem('orderPrice', dish.rawPrice)
    router.push('/payment')
}
</script>

<style scoped>
.restaurant-page {
    min-height: 100vh;
}

.resto-hero {
    height: 70vh;
    min-height: 500px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 80px;
}

.hero-content {
    position: relative;
    z-index: 10;
}

.back-home-mini {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--text-dim);
    text-decoration: none;
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 30px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.05);
    border-radius: 50px;
    border: 1px solid var(--glass-border);
    transition: 0.3s;
}

.back-home-mini:hover {
    color: var(--primary);
    background: rgba(255,255,255,0.1);
    transform: translateX(-5px);
}

.badge {
    display: block;
    width: fit-content;
    margin: 0 auto 20px;
    padding: 8px 18px;
    background: rgba(0, 255, 221, 0.1);
    border: 1px solid var(--primary);
    color: var(--primary);
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 800;
}

.resto-hero h1 {
    font-size: 5rem;
    color: #fff;
    margin-bottom: 20px;
}

.resto-hero p {
    font-size: 1.3rem;
    color: var(--text-dim);
    max-width: 700px;
    margin: 0 auto 40px;
}

.hero-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.gallery-section {
    padding: 100px 5%;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 50px;
}

.gallery-item {
    height: 350px;
    position: relative;
    cursor: pointer;
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.6s;
}

.gallery-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    display: flex;
    align-items: flex-end;
    padding: 30px;
    opacity: 0;
    transition: 0.4s;
}

.gallery-item:hover .gallery-overlay {
    opacity: 1;
}

.gallery-item:hover img {
    transform: scale(1.1);
}

.caption {
    color: var(--primary);
    font-weight: 700;
    font-size: 1.2rem;
}

.highlights-section {
    padding: 100px 5%;
    background: rgba(255,255,255,0.02);
}

.menu-highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    margin-top: 60px;
}

.highlight-card {
    padding: 40px;
    position: relative;
}

.highlight-price {
    position: absolute;
    top: 25px;
    right: 25px;
    color: var(--primary);
    font-weight: 800;
}

.highlight-card h3 {
    font-size: 1.8rem;
    margin-bottom: 15px;
}

.highlight-card p {
    color: var(--text-dim);
    margin-bottom: 30px;
    font-size: 0.95rem;
    line-height: 1.6;
}

.try-btn {
    background: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    transition: 0.3s;
}

.try-btn:hover {
    background: var(--primary);
    color: var(--dark-bg);
}

.map-section {
    padding: 100px 5% 150px;
}

.location-card {
    max-width: 900px;
    margin: 0 auto;
    padding: 60px;
    text-align: center;
}

.icon-box {
    width: 80px;
    height: 80px;
    background: rgba(0, 255, 221, 0.1);
    border-radius: 50%;
    margin: 0 auto 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: var(--primary);
}

.location-info h3 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.location-info p {
    color: var(--text-dim);
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto 40px;
}

.hours {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 400px;
    margin: 0 auto;
}

.hour-item {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
}

@media (max-width: 768px) {
    .resto-hero h1 { font-size: 3rem; }
    .hero-actions { flex-direction: column; padding: 0 10%; }
    .location-card { padding: 40px 20px; }
}
</style>
