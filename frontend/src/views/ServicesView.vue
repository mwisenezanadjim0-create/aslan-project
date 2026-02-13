<template>
  <div class="services-view">
    <NavBar />

    <header class="services-header reveal">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h1 class="dancing-script">Our Premium Services</h1>
        <p>Beyond dining—we create experiences tailored specifically to your needs.</p>
        <div class="header-divider"></div>
      </div>
    </header>

    <main class="services-grid container">
      <div 
        v-for="service in services" 
        :key="service.title" 
        class="service-card card-premium reveal"
        @click="openBooking(service.type)"
      >
        <div class="card-icon">
          <i :class="service.icon"></i>
        </div>
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
        <ul class="feature-list">
          <li v-for="feat in service.features" :key="feat">
            <i class="fas fa-check"></i> {{ feat }}
          </li>
        </ul>
        <button class="service-btn">
          Inquire Now <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </main>

    <!-- Booking Modal -->
    <BookingModal 
      :isOpen="isModalOpen" 
      :serviceType="selectedService"
      @close="isModalOpen = false" 
    />

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import BookingModal from '@/components/BookingModal.vue'

const isModalOpen = ref(false)
const selectedService = ref('Reservation')

const services = [
  {
    type: 'Reservation',
    title: 'Table Reservations',
    icon: 'fas fa-utensils',
    description: 'Ensure your spot in our dining room. Perfect for date nights or family dinners.',
    features: ['Instant confirmation', 'Preference choice', 'SMS Reminder']
  },
  {
    type: 'Catering',
    title: 'Outside Catering',
    icon: 'fas fa-truck-loading',
    description: 'Bring Aslan Cafe to your office or home. Professional service and fresh food.',
    features: ['Bulk ordering', 'Wait staff supply', 'Custom menus']
  },
  {
    type: 'Conference',
    title: 'Meetings & Conferences',
    icon: 'fas fa-handshake',
    description: 'Quiet, professional spaces equipped with high-speed internet and AV equipment.',
    features: ['Projector & Screen', 'Catering included', 'Up to 50 pax']
  },
  {
    type: 'Event',
    title: 'Event Bookings',
    icon: 'fas fa-glass-cheers',
    description: 'Host your special day with us. From birthdays to corporate launches.',
    features: ['Full venue hire', 'Decor services', 'Live music setup']
  },
  {
    type: 'Inquiry',
    title: 'Digital Inquiries',
    icon: 'fas fa-info-circle',
    description: 'Have specific questions or unique requests? Talk to our digital assistance team.',
    features: ['Quick response', 'Personal support', 'Tailored solutions']
  }
]

const openBooking = (type) => {
  selectedService.value = type
  isModalOpen.value = true
}

onMounted(() => {
  // Simple reveal animation
  const reveals = document.querySelectorAll('.reveal')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, { threshold: 0.1 })
  
  reveals.forEach(el => observer.observe(el))
})
</script>

<style scoped>
.services-view {
  background: var(--dark-bg);
  min-height: 100vh;
}

.services-header {
  height: 60vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1400&q=80') center/cover;
}

.header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.4), var(--dark-bg));
}

.header-content {
  position: relative;
  z-index: 2;
  padding: 0 20px;
}

.header-content h1 {
  font-size: 5rem;
  color: #fff;
  margin-bottom: 15px;
}

.header-content p {
  font-size: 1.35rem;
  color: var(--text-dim);
  max-width: 600px;
  margin: 0 auto 30px;
}

.header-divider {
  width: 80px;
  height: 4px;
  background: var(--primary);
  margin: 0 auto;
  border-radius: 2px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  padding: 100px 20px;
  margin-top: -100px;
  position: relative;
  z-index: 10;
}

.service-card {
  padding: 40px;
  cursor: pointer;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-15px);
  border-color: var(--primary);
  box-shadow: 0 20px 40px rgba(0, 255, 221, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 25px;
}

.service-card h3 {
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 15px;
}

.service-card p {
  color: var(--text-dim);
  line-height: 1.7;
  margin-bottom: 25px;
  flex-grow: 1;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.feature-list li i {
  color: var(--primary);
  font-size: 0.8rem;
}

.service-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 15px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
}

.service-card:hover .service-btn {
  background: var(--primary);
  color: var(--dark-bg);
  border-color: var(--primary);
}

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: 0.8s ease-out;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .header-content h1 { font-size: 3rem; }
  .header-content p { font-size: 1.1rem; }
  .services-header { height: 45vh; }
  .services-grid { margin-top: -50px; padding: 40px 15px; grid-template-columns: 1fr; }
  .service-card { padding: 30px 20px; }
  .service-card h3 { font-size: 1.5rem; }
}

@media (max-width: 480px) {
  .header-content h1 { font-size: 2.5rem; }
  .services-header { height: 40vh; }
  .services-grid { margin-top: -30px; }
}
</style>
