<template>
  <header class="main-nav-container" :class="{ 'scrolled': isScrolled }">
    <div class="nav-content">
      <RouterLink to="/" class="logo">
        <img src="@/assets/img/2.png" alt="Aslan Logo">
      </RouterLink>

      <div class="hamburger" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav class="nav-links" :class="{ 'mobile-active': isMenuOpen }">
        <RouterLink to="/#prod" class="nav-item" @click="isMenuOpen = false">
            <span class="item-icon"><i class="fas fa-utensils"></i></span>
            Product
        </RouterLink>
        <RouterLink to="/store" class="nav-item" @click="isMenuOpen = false">
            <span class="item-icon"><i class="fas fa-shopping-bag"></i></span>
            Store
        </RouterLink>
        <RouterLink to="/restaurant" class="nav-item" @click="isMenuOpen = false">
            <span class="item-icon"><i class="fas fa-store"></i></span>
            Restaurant
        </RouterLink>
        <div class="auth-group">
          <RouterLink to="/login" class="login-btn" @click="isMenuOpen = false">Login</RouterLink>
          <RouterLink to="/signup" class="signup-btn" @click="isMenuOpen = false">
            Get Started
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.main-nav-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 0;
  z-index: 1000;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  background: rgba(11, 15, 26, 0.2);
  backdrop-filter: blur(5px);
}

.main-nav-container.scrolled {
  padding: 15px 0;
  background: rgba(11, 15, 26, 0.8);
  backdrop-filter: blur(30px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
    gap: 15px;
    text-decoration: none;
}

.logo img {
  height: clamp(50px, 8vw, 85px);
  width: auto;
  filter: brightness(0) invert(1) drop-shadow(0 0 15px rgba(0, 255, 221, 0.5));
  transition: 0.3s;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 12px 20px;
  border-radius: 15px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.8;
}

.item-icon {
    font-size: 1rem;
    color: var(--primary);
    opacity: 0.6;
    transition: 0.3s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  opacity: 1;
}

.nav-item:hover .item-icon {
    opacity: 1;
    transform: scale(1.2);
}

.nav-item.router-link-active {
    background: rgba(0, 255, 221, 0.08);
    color: var(--primary);
    opacity: 1;
}

.auth-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid rgba(255,255,255,0.1);
}

.login-btn {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  padding: 12px 25px;
  opacity: 0.7;
  transition: 0.3s;
}

.login-btn:hover {
    opacity: 1;
}

.signup-btn {
  background: var(--primary);
  color: var(--dark-bg);
  padding: 14px 30px;
  border-radius: 18px;
  font-weight: 800;
  text-decoration: none;
  font-size: 0.95rem;
  box-shadow: 0 8px 25px rgba(0, 255, 221, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.signup-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 255, 221, 0.5);
  background: #fff;
}

/* HAMBURGER */
.hamburger {
  display: none;
  cursor: pointer;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
}

.hamburger span {
  width: 30px;
  height: 3px;
  background: #fff;
  border-radius: 3px;
  transition: 0.4s;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 1024px) {
  .hamburger {
    display: flex;
    z-index: 1001;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 320px;
    height: 100vh;
    background: #0b111e;
    flex-direction: column;
    justify-content: center;
    padding: 100px 40px;
    transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    box-shadow: -15px 0 50px rgba(0,0,0,0.8);
  }

  .nav-links.mobile-active {
    right: 0;
  }

  .nav-item {
      width: 100%;
      font-size: 1.2rem;
      padding: 20px;
  }

  .auth-group {
    flex-direction: column;
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    width: 100%;
    margin-top: 40px;
  }

  .signup-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .main-nav-container {
    padding: 10px 0;
  }

  .nav-content {
      padding: 0 15px;
  }

  .logo img {
    height: 45px;
  }

  .nav-links {
    width: 280px;
    padding: 80px 30px;
  }

  .nav-item {
    font-size: 1.1rem;
    padding: 16px;
  }

  .hamburger span {
    width: 26px;
  }
}
</style>
