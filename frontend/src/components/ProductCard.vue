<template>
  <div class="product-card-container card-premium">
    <div class="image-wrapper">
      <img :src="image" :alt="name">
      <div class="rating-badge">
        <i class="fas fa-star"></i> {{ rating }}
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="product-name">{{ name }}</h3>
      <div class="price-row">
        <span class="currency">RWF</span>
        <span class="amount">{{ Number(price).toLocaleString() }}</span>
      </div>
      
      <button class="order-btn" @click="orderNow">
        <span class="btn-text">Add to Cart</span>
        <span class="btn-icon"><i class="fas fa-cart-shopping"></i></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'

const props = defineProps({
  id: [Number, String],
  name: String,
  price: [Number, String],
  image: String,
  rating: [Number, String]
})

const cartStore = useCartStore()
const router = useRouter()

const orderNow = () => {
  cartStore.addItem({
    id: props.id,
    name: props.name,
    price: props.price,
    image: props.image
  })
  cartStore.isCartOpen = true
}
</script>

<style scoped>
.product-card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.product-card-container:hover .image-wrapper img {
  transform: scale(1.1) rotate(2deg);
}

.rating-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(11, 15, 26, 0.6);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffcc00;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-content {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
}

.price-row {
  margin-bottom: 25px;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.currency {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
  opacity: 0.8;
}

.amount {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
}

.order-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: #fff;
  padding: 15px;
  border-radius: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.order-btn:hover {
  background: var(--primary);
  color: var(--dark-bg);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 255, 221, 0.2);
}

.btn-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-btn:hover .btn-icon {
  background: rgba(0, 0, 0, 0.1);
}
</style>
