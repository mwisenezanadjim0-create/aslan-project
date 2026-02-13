<template>
  <Transition name="comment-modal">
    <div v-if="isOpen" class="comment-overlay" @click.self="$emit('close')">
      <div class="comment-box card-premium">
        <button class="close-btn" @click="$emit('close')">&times;</button>
        
        <div class="comment-header">
          <div class="celebration-icon">🎈</div>
          <h2>Be One of the First!</h2>
          <p>You are one of our very first customers. We would love to hear your thoughts on our food!</p>
        </div>

        <form @submit.prevent="submitComment" class="comment-form">
          <div class="input-wrap">
            <label>Your Name</label>
            <input v-model="form.name" type="text" placeholder="e.g., John D." required />
          </div>

          <div class="input-wrap">
            <label>Rating</label>
            <div class="star-rating">
              <i 
                v-for="i in 5" 
                :key="i" 
                class="fa-star" 
                :class="i <= form.rating ? 'fas active' : 'far'"
                @click="form.rating = i"
              ></i>
            </div>
          </div>

          <div class="input-wrap">
            <label>Your Feedback</label>
            <textarea v-model="form.text" placeholder="How was your meal? Your comment will appear on our home page!" required></textarea>
          </div>

          <button type="submit" class="submit-comment-btn" :disabled="loading">
            <span v-if="!loading">Post My Comment</span>
            <i v-else class="fas fa-spinner fa-spin"></i>
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useNotificationStore } from '@/store/notification'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'success'])
const notification = useNotificationStore()
const loading = ref(false)

const form = reactive({
  name: '',
  rating: 5,
  text: ''
})

const submitComment = async () => {
  if (!form.name || !form.text) return
  
  loading.value = true
  try {
    await axios.post('/api/reviews', form)
    notification.success("Thank you for your feedback! It's now live on our home page.")
    emit('success')
    emit('close')
  } catch (err) {
    notification.error("Failed to post comment. Please try again.")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.comment-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  padding: 20px;
}

.comment-box {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  position: relative;
  border: 1px solid rgba(0, 255, 221, 0.2);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;
}

.comment-header {
  text-align: center;
  margin-bottom: 30px;
}

.celebration-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.comment-header h2 {
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 10px;
}

.comment-header p {
  font-size: 0.95rem;
  opacity: 0.8;
  line-height: 1.5;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrap label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

input, textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 12px;
  color: #fff;
  outline: none;
}

input:focus, textarea:focus {
  border-color: var(--primary);
}

textarea {
  height: 100px;
  resize: none;
}

.star-rating {
  display: flex;
  gap: 8px;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.2);
}

.star-rating i {
  cursor: pointer;
  transition: 0.2s;
}

.star-rating i.active {
  color: #ffae00;
}

.submit-comment-btn {
  background: var(--primary);
  color: var(--dark-bg);
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
}

.submit-comment-btn:hover {
  transform: translateY(-3px);
  background: #fff;
}

.comment-modal-enter-active, .comment-modal-leave-active {
  transition: all 0.4s ease;
}

.comment-modal-enter-from, .comment-modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
