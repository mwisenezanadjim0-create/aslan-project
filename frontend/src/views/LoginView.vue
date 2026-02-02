<template>
  <div class="box">
    <div class="login-box">
      <div class="employee-notice">
        <i class="fas fa-user-shield"></i>
        <span><strong>Admin Notice:</strong> Only Aslan employees are allowed to login. If you are not an employee, please <RouterLink to="/">go back</RouterLink>.</span>
      </div>
      <h2>Welcome Back</h2>
      <form @submit.prevent="handleLogin">
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
        <div class="remember-forgot">
          <label><input type="checkbox"> Remember me</label>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" :disabled="isLoading">
            <span v-if="isLoading"><i class="fas fa-circle-notch fa-spin"></i> Checking...</span>
            <span v-else>Login</span>
        </button>
        <div class="register-link">
          <p>Don't have an account? <RouterLink to="/signup">Sign Up</RouterLink></p>
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

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
    isLoading.value = true
    const res = await authStore.login(email.value, password.value)
    
    isLoading.value = false
    
    if (res.success) {
        notification.success(`Welcome back, ${authStore.user.username}!`)
        router.push('/dashboard')
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

.employee-notice {
    background: rgba(255, 204, 0, 0.1);
    border: 1px solid rgba(255, 204, 0, 0.2);
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 0.85rem;
    color: #ffcc00;
}

.employee-notice i {
    font-size: 1.5rem;
}

.employee-notice a {
    color: #fff;
    text-decoration: underline;
    font-weight: 700;
}

.employee-notice a:hover {
    color: var(--primary);
}
</style>
