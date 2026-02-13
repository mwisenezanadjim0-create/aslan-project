<template>
  <div class="cart-wrapper" :class="{ 'active': cartStore.isCartOpen }">
    <div class="cart-overlay" @click="cartStore.toggleCart"></div>
    
    <div class="cart-drawer">
      <div class="cart-header">
        <div class="header-main">
          <h2>Your Selection</h2>
          <span class="item-count">{{ cartStore.totalItems }} Items</span>
        </div>
        <button class="close-btn" @click="cartStore.toggleCart">&times;</button>
      </div>

      <div class="cart-body">
        <div v-if="cartStore.isEmpty" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Treat yourself to something delicious from our menu!</p>
          <button class="btn-primary" @click="goToMenu">Browse Menu</button>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <div class="item-price">{{ Number(item.price).toLocaleString() }} RWF</div>
            </div>
            <div class="item-controls">
              <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!cartStore.isEmpty" class="cart-footer">
        <div class="total-row">
          <span>Total</span>
          <span class="total-price">{{ cartStore.totalPrice.toLocaleString() }} RWF</span>
        </div>
        <button class="checkout-btn" @click="checkout">
          Proceed to Checkout <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/store/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const goToMenu = () => {
  cartStore.isCartOpen = false
  router.push('/product')
}

const checkout = () => {
  cartStore.isCartOpen = false
  router.push('/payment')
}
</script>

<style scoped>
.cart-wrapper {
  position: fixed;
  inset: 0;
  z-index: 2000;
  visibility: hidden;
  transition: 0.3s;
}

.cart-wrapper.active {
  visibility: visible;
}

.cart-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: 0.3s;
}

.cart-wrapper.active .cart-overlay {
  opacity: 1;
}

.cart-drawer {
  position: absolute;
  right: -400px;
  top: 0;
  width: 400px;
  height: 100%;
  background: #0b111e;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.cart-wrapper.active .cart-drawer {
  right: 0;
}

.cart-header {
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main h2 {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.item-count {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.5;
  transition: 0.3s;
}

.close-btn:hover {
  opacity: 1;
  color: var(--primary);
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.2;
}

.cart-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info h4 {
  font-size: 1rem;
  margin-bottom: 5px;
}

.item-price {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px 12px;
  border-radius: 10px;
}

.item-controls button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 800;
}

.cart-footer {
  padding: 30px;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  font-size: 1.2rem;
  font-weight: 700;
}

.total-price {
  color: var(--primary);
}

.checkout-btn {
  width: 100%;
  background: var(--primary);
  color: var(--dark-bg);
  border: none;
  padding: 18px;
  border-radius: 15px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
}

.checkout-btn:hover {
  background: #fff;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
}

@media (max-width: 480px) {
  .cart-drawer {
    width: 100%;
    right: -100%;
  }
}
</style>
