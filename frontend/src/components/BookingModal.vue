<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content card-premium">
        <button class="close-btn" @click="$emit('close')">&times;</button>
        
        <div class="booking-header">
          <h2 class="dancing-script">{{ serviceTitle }}</h2>
          <p>{{ serviceSubtitle }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="booking-form">
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" type="text" placeholder="Your full name" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input v-model="form.date" type="date" required />
            </div>
            <div class="form-group">
              <label>Time</label>
              <input v-model="form.time" type="time" :required="isTimeRequired" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ guestsLabel }}</label>
              <input v-if="serviceType === 'Catering' || serviceType === 'Event'" v-model="form.guests" type="number" placeholder="Estimated" />
              <select v-else v-model="form.guests">
                <option v-for="n in [2,4,6,8,10,12,15,20]" :key="n" :value="n">{{ n }} Person{{ n > 1 ? 's' : '' }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="form.phone" type="tel" placeholder="07... " required />
            </div>
          </div>

          <div class="form-group">
            <label>Additional Details</label>
            <textarea v-model="form.notes" :placeholder="detailsPlaceholder"></textarea>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="!loading">Send Inquiry</span>
            <i v-else class="fas fa-spinner fa-spin"></i>
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useNotificationStore } from '@/store/notification'

const props = defineProps({
  isOpen: Boolean,
  serviceType: {
    type: String,
    default: 'Reservation'
  }
})

const emit = defineEmits(['close'])
const notificationStore = useNotificationStore()
const loading = ref(false)

const form = reactive({
  name: '',
  date: '',
  time: '',
  guests: 2,
  phone: '',
  notes: ''
})

const serviceTitle = computed(() => {
  switch (props.serviceType) {
    case 'Catering': return 'Outside Catering'
    case 'Conference': return 'Meeting & Conferences'
    case 'Event': return 'Events Booking'
    case 'Inquiry': return 'Digital Inquiry'
    default: return 'Online Reservation'
  }
})

const serviceSubtitle = computed(() => {
  switch (props.serviceType) {
    case 'Catering': return 'Let us bring the Aslan experience to your location.'
    case 'Conference': return 'Premium spaces for your professional gatherings.'
    case 'Event': return 'Celebrate your special moments with us.'
    case 'Inquiry': return 'Have a question? We are here to help.'
    default: return 'Join us for an unforgettable dining experience.'
  }
})

const isTimeRequired = computed(() => props.serviceType !== 'Catering' && props.serviceType !== 'Inquiry')
const guestsLabel = computed(() => (props.serviceType === 'Catering' || props.serviceType === 'Event') ? 'Estimated Guests' : 'Guests')
const detailsPlaceholder = computed(() => {
  switch (props.serviceType) {
    case 'Catering': return 'Event location, menu preferences...'
    case 'Event': return 'Type of event, decoration needs...'
    case 'Inquiry': return 'What can we help you with?'
    default: return 'Special requests, allergies...'
  }
})

const handleSubmit = async () => {
  if (loading.value) return
  loading.value = true
  
  try {
    await axios.post('/api/bookings/submit', {
      serviceType: props.serviceType,
      customerName: form.name,
      customerPhone: form.phone,
      date: form.date,
      time: form.time,
      guests: form.guests,
      details: form.notes
    })

    notificationStore.success(`Your ${props.serviceType} inquiry has been sent to our team!`)
    emit('close')
    
    // Clear form
    form.name = ''
    form.date = ''
    form.time = ''
    form.guests = 2
    form.phone = ''
    form.notes = ''
    
  } catch (err) {
    notificationStore.error("Failed to submit inquiry. Please try again.")
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 550px;
  background: #0b111e;
  padding: 40px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.5;
}

.booking-header {
  text-align: center;
  margin-bottom: 35px;
}

.booking-header h2 {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 10px;
}

.booking-header p {
  color: var(--text-dim);
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

input, select, textarea {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 15px;
  color: #fff;
  font-family: inherit;
  outline: none;
  transition: 0.3s;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
}

textarea {
  height: 100px;
  resize: none;
}

.submit-btn {
  background: var(--primary);
  color: var(--dark-bg);
  border: none;
  padding: 18px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #fff;
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0, 255, 221, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Modal Transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modal-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-in {
  from { transform: scale(0.8) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
  .modal-content { padding: 30px 20px; }
}
</style>
