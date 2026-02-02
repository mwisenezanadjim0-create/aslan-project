<template>
  <div class="box">
    <div class="login-box">
      <h2>Create Account</h2>
      <form @submit.prevent="handleSignup">
        <div class="input-box">
           <span class="icon"><i class="fas fa-user"></i></span>
           <input v-model="username" type="text" required>
           <label :class="{ filled: username }">Username</label>
        </div>
        <div class="input-box">
          <span class="icon"><i class="fas fa-envelope"></i></span>
          <input v-model="email" type="email" required>
          <label :class="{ filled: email }">Email</label>
        </div>
        <div class="input-box">
          <span class="icon"><i class="fas fa-lock"></i></span>
          <input v-model="password" type="password" required>
          <label :class="{ filled: password }">Password</label>
        </div>
        
        <button type="submit" :disabled="isLoading">
            <span v-if="isLoading"><i class="fas fa-circle-notch fa-spin"></i> Creating...</span>
            <span v-else>Sign Up</span>
        </button>
        <div class="register-link">
          <p>Already have an account? <RouterLink to="/login">Login</RouterLink></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notification'
import '@/assets/auth.css'

const notification = useNotificationStore()

const username = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const handleSignup = async () => {
    isLoading.value = true
    const res = await authStore.signup(username.value, email.value, password.value)
    
    isLoading.value = false
    
    if (res.success) {
       notification.success("Account created successfully! You can now login.")
       router.push('/login')
    } else {
        notification.error(res.message)
    }
}
</script>

<style scoped>
.input-box label.filled {
  top: -12px;
  font-size: 12px;
}
</style>
