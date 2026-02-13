<script setup>
import { RouterView } from 'vue-router'
import ToastNotification from '@/components/ToastNotification.vue'
import CartDrawer from '@/components/CartDrawer.vue'
</script>

<template>
  <div class="app-root">
    <ToastNotification />
    <CartDrawer />
    <!-- Global Background Elements -->
    <div class="bg-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
    </div>
    
    <RouterView />
  </div>
</template>

<style>
.app-root {
  min-height: 100vh;
  width: 100%;
  position: relative;
}
</style>
