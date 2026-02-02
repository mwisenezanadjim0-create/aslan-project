<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="n in notificationStore.notifications" 
        :key="n.id" 
        :class="['toast-item', n.type]"
      >
        <div class="toast-icon">
          <i v-if="n.type === 'success'" class="fas fa-check-circle"></i>
          <i v-else-if="n.type === 'error'" class="fas fa-exclamation-circle"></i>
          <i v-else class="fas fa-info-circle"></i>
        </div>
        <div class="toast-content">{{ n.message }}</div>
        <button class="toast-close" @click="notificationStore.remove(n.id)">
          &times;
        </button>
        <div class="toast-progress" :style="{ animationDuration: n.duration + 'ms' }"></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/store/notification'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  min-width: 300px;
  max-width: 450px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.toast-item.success {
  border-left: 4px solid #10b981;
}
.toast-item.error {
  border-left: 4px solid #ef4444;
}
.toast-item.info {
  border-left: 4px solid #3b82f6;
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.success .toast-icon { color: #10b981; }
.error .toast-icon { color: #ef4444; }
.info .toast-icon { color: #3b82f6; }

.toast-content {
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 500;
  flex-grow: 1;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #fff;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
  transform-origin: left;
  animation: progress linear forwards;
}

@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}
</style>
