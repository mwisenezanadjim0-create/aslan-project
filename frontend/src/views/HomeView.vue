<template>
  <div class="home-container">
    <NavBar />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content-wrapper">
        <div class="hero-text reveal">
          <div class="hero-logo-wrapper">
            <img src="@/assets/img/2.png" alt="Aslan Logo" class="hero-body-logo">
          </div>
          <div class="live-status-box" v-motion-fade>
             <div class="status-indicator ripple"></div>
             <span>Kitchen Status: <strong>15-20 min Wait Time</strong></span>
          </div>
          <div class="badge-wrapper">
            <span class="badge valentine-badge"><i class="fas fa-heart"></i> VALENTINE'S DAY SPECIAL</span>
          </div>
          <h1 class="hero-title">
            Love in Every <br/> 
            <span class="highlight">Bite</span>
          </h1>
          <p class="hero-description">
            Celebrate love with our specially curated Valentine's menus, romantic dining experiences, and unforgettable moments.
          </p>
          
          <div class="hero-actions">
            <button class="btn-primary" @click="$router.push('/product')">
              Start Your Order Now <i class="fas fa-arrow-right"></i>
            </button>
            <button class="btn-outline" @click="$router.push('/restaurant')">
              View Restaurant
            </button>
          </div>
        </div>

        <div class="hero-visual reveal">
          <div class="slider-wrapper">
            <div class="main-slider">
              <img v-for="(img, index) in slides" 
                   :key="index" 
                   :src="img" 
                   :class="{ active: currentSlide === index }" 
                   class="slide-img"
                   alt="Featured Dish">
              
              <div class="slider-nav">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                </div>
                <div class="nav-dots">
                  <span v-for="(img, index) in slides" 
                        :key="index" 
                        :class="{ active: currentSlide === index }" 
                        @click="setSlide(index)"></span>
                </div>
              </div>
            </div>
            
            <!-- Floaties with better positioning -->
            <!-- Valentine's Floaties -->
            <div class="floating-item fi-1"><i class="fas fa-heart"></i></div>
            <div class="floating-item fi-2"><i class="fas fa-rose"></i></div>
            <div class="floating-item fi-3"><i class="fas fa-gift"></i></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="experience-bar reveal">
        <div class="bar-content">
            <div class="exp-item">
                <span class="exp-num">500+</span>
                <span class="exp-lab">Daily Orders</span>
            </div>
            <div class="exp-divider"></div>
            <div class="exp-item">
                <span class="exp-num">15min</span>
                <span class="exp-lab">Fastest Delivery</span>
            </div>
            <div class="exp-divider"></div>
            <div class="exp-item">
                <span class="exp-num">4.9/5</span>
                <span class="exp-lab">User Rating</span>
            </div>
        </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-section reveal" id="prod">
      <div class="container">
        <div class="section-header">
          <h2 class="dancing-script">Our Chef's Special</h2>
          <div class="header-divider"></div>
          <p>Hand-picked delights prepared with love and premium ingredients.</p>
        </div>

        <div class="cards-grid">
          <ProductCard 
            v-for="product in products" 
            :key="product.id"
            v-bind="product"
          />
        </div>
        
        <div class="view-all-container">
          <button @click="$router.push('/product')" class="btn-view-more">
            View All Products <i class="fas fa-th-large"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section container">
        <div class="section-header">
          <h2 class="dancing-script">What Our Guests Say</h2>
          <div class="header-divider"></div>
          <p>Real stories from our beloved dining community.</p>
        </div>
        
        <div class="testimonials-grid">
          <!-- Real Reviews -->
          <div 
            v-for="r in realReviews" 
            :key="r._id" 
            class="testimonial-card card-premium"
          >
            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
            <p class="testimonial-text">"{{ r.text }}"</p>
            <div class="author-details">
              <strong>{{ r.name }}</strong>
              <div class="stars">
                <i class="fas fa-star" v-for="i in Number(r.rating || 5)" :key="i"></i>
              </div>
            </div>
          </div>

          <!-- Fallback Placeholders (Only show if no real reviews yet) -->
          <template v-if="realReviews.length === 0">
            <div class="testimonial-card card-premium">
              <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
              <p class="testimonial-text">"The best pizza I've had in Kigali! The crust is perfect and the service is exceptionally fast."</p>
              <div class="author-details">
                <strong>John Doe</strong>
                <div class="stars">
                  <i class="fas fa-star" v-for="i in 5" :key="i"></i>
                </div>
              </div>
            </div>
            
            <div class="testimonial-card card-premium">
              <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
              <p class="testimonial-text">"Aslan Café has a vibe like no other. Great place for digital nomads and coffee lovers."</p>
              <div class="author-details">
                <strong>Sarah Kimani</strong>
                <div class="stars">
                  <i class="fas fa-star" v-for="i in 5" :key="i"></i>
                </div>
              </div>
            </div>

            <div class="testimonial-card card-premium">
              <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
              <p class="testimonial-text">"Their live dashboard tracking is so cool. I always know exactly when my order is ready."</p>
              <div class="author-details">
                <strong>David Mutua</strong>
                <div class="stars">
                  <i class="fas fa-star" v-for="i in 5" :key="i"></i>
                </div>
              </div>
            </div>
          </template>
        </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'

// Import Slider Images
import item1 from '@/assets/img/item1.png'
import item2 from '@/assets/img/item2.png'
import item3 from '@/assets/img/item3.png'
import item4 from '@/assets/img/item4.png'
import item5 from '@/assets/img/item5.png'
import item6 from '@/assets/img/item6.png'

const slides = [item1, item2, item3, item4, item5, item6]
const currentSlide = ref(0)
const progress = ref(0)
const realReviews = ref([])
let timer = null
let progressTimer = null

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
    progress.value = 0
}

const setSlide = (index) => {
    currentSlide.value = index
    progress.value = 0
    resetTimer()
}

const resetTimer = () => {
    clearInterval(timer)
    clearInterval(progressTimer)
    timer = setInterval(nextSlide, 5000)
    progressTimer = setInterval(() => {
        progress.value += 2
    }, 100)
}

const products = [
  { id: 1, name: "Aslan Fish Master Plate", price: 30000, rating: 5.0, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Aslan Chicken Master Plate", price: 30000, rating: 4.9, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "BBQ Chicken Pizza", price: 12000, rating: 4.8, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Meat Deluxe Pizza", price: 12000, rating: 4.7, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Full Chicken with Chips", price: 20000, rating: 4.9, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "King Beef Burger", price: 8000, rating: 4.7, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" }
]

const fetchReviews = async () => {
  try {
    const { data } = await axios.get('/api/reviews')
    realReviews.value = data.slice(0, 3) // Only show the latest 3
  } catch (err) {
    console.error("Failed to fetch reviews", err)
  }
}

onMounted(() => {
    resetTimer()
    fetchReviews()
})

onUnmounted(() => {
    clearInterval(timer)
    clearInterval(progressTimer)
})
</script>

<style scoped>
.home-container {
    overflow-x: hidden;
}

.hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 140px 5% 60px;
    position: relative;
    z-index: 10;
}

.hero-content-wrapper {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 80px;
}

.hero-text {
    flex: 1;
    max-width: 650px;
}

.hero-logo-wrapper {
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-start;
}

.hero-body-logo {
    height: 340px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    filter: brightness(0) invert(1) drop-shadow(0 0 20px rgba(0, 255, 221, 0.3));
}

.live-status-box {
    background: rgba(255, 174, 0, 0.1);
    border: 1px solid rgba(255, 174, 0, 0.2);
    padding: 10px 20px;
    border-radius: 50px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
    color: #ffae00;
    font-size: 0.9rem;
    font-weight: 600;
}

.status-indicator {
    width: 10px;
    height: 10px;
    background: #ffae00;
    border-radius: 50%;
    position: relative;
}

.ripple::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background: #ffae00;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ripple 2s infinite;
}

@keyframes ripple {
    0% { width: 10px; height: 10px; opacity: 1; }
    100% { width: 30px; height: 30px; opacity: 0; }
}

.badge-wrapper {
    margin-bottom: 30px;
}

.badge {
    padding: 8px 18px;
    background: rgba(0, 255, 221, 0.1);
    border: 1px solid rgba(0, 255, 221, 0.2);
    color: var(--primary);
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.valentine-badge {
    background: rgba(255, 105, 180, 0.1);
    border: 1px solid rgba(255, 105, 180, 0.3);
    color: #ff69b4;
}


.hero-title {
    font-size: 5rem;
    font-weight: 900;
    line-height: 1.05;
    color: #fff;
    margin-bottom: 30px;
    letter-spacing: -2px;
}

.highlight {
    color: var(--primary);
    background: linear-gradient(135deg, var(--primary), #fff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 20px rgba(0, 255, 221, 0.4));
}

.hero-description {
    font-size: 1.35rem;
    color: var(--text-dim);
    margin-bottom: 45px;
    line-height: 1.6;
    max-width: 580px;
}

.hero-actions {
    display: flex;
    gap: 25px;
}

.hero-visual {
    flex: 1;
    display: flex;
    justify-content: flex-end;
}

.slider-wrapper {
    position: relative;
    width: 580px;
    height: 580px;
}

.main-slider {
    width: 100%;
    height: 100%;
    border-radius: 50px;
    overflow: hidden;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    position: relative;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6);
}

.slide-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: 1s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform: scale(1.1);
}

.slide-img.active {
    opacity: 1;
    transform: scale(1);
}

.slider-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 30px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 20;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary);
    transition: width 0.1s linear;
}

.nav-dots {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.nav-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: 0.3s;
    border: 1px solid rgba(255,255,255,0.1);
}

.nav-dots span.active {
    background: var(--primary);
    transform: scale(1.3);
    box-shadow: 0 0 15px var(--primary);
}

/* FLOATING ITEMS */
.floating-item {
    position: absolute;
    width: 80px;
    height: 80px;
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: var(--primary);
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    animation: floating 6s infinite ease-in-out;
    z-index: 25;
}

.fi-1 { top: -20px; right: -20px; animation-delay: 0s; }
.fi-2 { bottom: 40px; left: -40px; animation-delay: -2s; }
.fi-3 { top: 40%; left: -20px; animation-delay: -4s; color: var(--accent); }

@keyframes floating {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(10deg); }
}

/* EXPERIENCE BAR */
.experience-bar {
    padding: 60px 5%;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid var(--glass-border);
    border-bottom: 1px solid var(--glass-border);
}

.bar-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.exp-item {
    text-align: center;
}

.exp-num {
    display: block;
    font-size: 3rem;
    font-weight: 800;
    color: var(--primary);
    line-height: 1;
}

.exp-lab {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-dim);
    font-weight: 600;
}

.exp-divider {
    width: 1px;
    height: 60px;
    background: var(--glass-border);
}

/* FEATURED SECTION */
.featured-section {
    padding: 120px 5%;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

.section-header {
    text-align: center;
    margin-bottom: 80px;
}

.section-header h2 {
    font-size: 5rem;
    margin-bottom: 15px;
    color: #fff;
}

.header-divider {
    width: 80px;
    height: 4px;
    background: var(--primary);
    margin: 20px auto;
    border-radius: 2px;
}

.section-header p {
    font-size: 1.3rem;
    color: var(--text-dim);
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    margin-bottom: 80px;
}

.view-all-container {
    display: flex;
    justify-content: center;
}

.btn-view-more {
    background: var(--glass);
    border: 1px solid var(--primary);
    color: var(--primary);
    padding: 20px 50px;
    border-radius: 50px;
    font-size: 1.25rem;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    gap: 15px;
}

.btn-view-more:hover {
    background: var(--primary);
    color: var(--dark-bg);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 255, 221, 0.3);
}

/* TESTIMONIALS SECTION */
.testimonials-section {
    padding: 120px 0;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    margin-top: 60px;
}

.testimonial-card {
    padding: 45px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.quote-icon {
    font-size: 2.5rem;
    color: var(--primary);
    opacity: 0.2;
    margin-bottom: 25px;
}

.testimonial-text {
    font-size: 1.15rem;
    font-style: italic;
    color: var(--text-dim);
    line-height: 1.7;
    margin-bottom: 35px;
}

.author-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 25px;
}

.author-details strong {
    font-size: 1.1rem;
    color: #fff;
}

.stars {
    display: flex;
    gap: 4px;
    color: #ffae00;
    font-size: 0.85rem;
}

@media (max-width: 1280px) {
    .hero-title { font-size: 4rem; }
    .slider-wrapper { width: 480px; height: 480px; }
}

@media (max-width: 1024px) {
    .hero-content-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 60px;
    }
    
    .hero-text {
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hero-logo-wrapper {
        justify-content: center;
    }

    .hero-body-logo {
        height: 250px;
    }
    
    .hero-actions {
        width: 100%;
        justify-content: center;
    }
    
    .hero-visual {
        justify-content: center;
        width: 100%;
    }
    
    .slider-wrapper {
        width: 100%;
        max-width: 500px;
        height: 500px;
    }
}

@media (max-width: 768px) {
    .hero-section {
        padding: 100px 20px 80px;
    }

    .hero-title { 
        font-size: 2.5rem;
        letter-spacing: -1px;
        margin-bottom: 20px;
    }

    .hero-description {
        font-size: 1.1rem;
        margin-bottom: 35px;
    }

    .hero-body-logo {
        height: 180px;
    }

    .hero-actions { 
        flex-direction: column;
        gap: 15px;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
        justify-content: center;
        padding: 16px 30px;
        font-size: 1rem;
    }

    .experience-bar {
        padding: 40px 20px;
    }

    .bar-content { 
        flex-direction: column; 
        gap: 35px; 
    }

    .exp-divider { 
        display: none; 
    }

    .exp-num {
        font-size: 2.5rem;
    }

    .exp-lab {
        font-size: 0.9rem;
    }

    .featured-section {
        padding: 80px 20px;
    }

    .section-header {
        margin-bottom: 50px;
    }

    .section-header h2 { 
        font-size: 2.5rem;
        line-height: 1.2;
    }

    .section-header p {
        font-size: 1.1rem;
    }

    .cards-grid {
        grid-template-columns: 1fr;
        gap: 25px;
        margin-bottom: 50px;
    }

    .btn-view-more {
        padding: 16px 40px;
        font-size: 1.1rem;
    }

    .slider-wrapper { 
        width: 100%;
        max-width: 400px;
        height: 400px; 
        margin: 0 auto;
    }

    .floating-item {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    .hero-title { 
        font-size: 2rem;
        margin-bottom: 15px;
    }

    .hero-description {
        font-size: 0.95rem;
    }

    .hero-body-logo {
        height: 140px;
    }

    .badge {
        font-size: 0.7rem;
        padding: 6px 14px;
    }

    .live-status-box {
        font-size: 0.8rem;
        padding: 8px 16px;
    }

    .section-header h2 { 
        font-size: 2rem;
    }

    .section-header p {
        font-size: 0.95rem;
    }

    .exp-num {
        font-size: 2rem;
    }

    .slider-wrapper { 
        width: 100%;
        max-width: 300px;
        height: 300px;
        border-radius: 30px;
    }

    .main-slider {
        border-radius: 30px;
    }

    .btn-view-more {
        padding: 14px 30px;
        font-size: 1rem;
    }
}
</style>
