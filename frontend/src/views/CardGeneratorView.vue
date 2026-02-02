<template>
  <div class="generator-page">
    <h1>🔒 Admin Pass Generator</h1>
    <p style="opacity: 0.7; margin-bottom: 20px;">Generate Digital Passes for confirmed WhatsApp payments.</p>
    <RouterLink to="/dashboard" style="color: #00ffdd; text-decoration: none; margin-bottom: 30px; display: inline-block;">
        <i class="fas fa-arrow-left"></i> Back to Dashboard
    </RouterLink>

    <div class="generator-card">
        <label>Customer Name</label>
        <input v-model="form.custName" type="text" placeholder="e.g. Nadjim">

        <label>Pass Type / Item</label>
        <select v-model="form.passType">
            <option value="Bronze Gift Card">Bronze Gift Card (10k)</option>
            <option value="Silver Gift Card">Silver Gift Card (25k)</option>
            <option value="Gold VIP Gift Card">Gold VIP Gift Card (50k)</option>
            <option value="Birthday Party Package">Birthday Party Package</option>
            <option value="Couple's Dinner Night">Couple's Dinner Night</option>
            <option value="Family Feast">Family Feast</option>
        </select>

        <div style="display: flex; gap: 15px;">
            <div style="flex: 1;">
                <label>Date Created</label>
                <input v-model="form.dateCreated" type="date">
            </div>
            <div style="flex: 1;">
                <label>Date Expired</label>
                <input v-model="form.dateExpired" type="date">
            </div>
        </div>

        <button @click="generatePreview" class="order-btn">🔄 Generate Preview</button>
    </div>

    <!-- PREVIEW AREA -->
    <div v-show="showPreview" id="digital-pass-container" style="max-width: 400px; margin-top: 30px;">
        <div class="digital-pass" ref="captureArea">
            <div class="pass-header">
                <span class="pass-type">OFFICIAL PASS</span>
                <img src="@/assets/img/2.png" alt="Logo" class="pass-logo">
            </div>
            <div class="pass-body">
                <h3 id="pass-item-name">{{ form.passType }}</h3>
                <p class="pass-owner">Name: <span id="pass-customer-name">{{ form.custName }}</span></p>
                <div class="pass-dates">
                    <div>
                        <small>CREATED ON:</small>
                        <span id="pass-issue-date">{{ formatDate(form.dateCreated) }}</span>
                    </div>
                    <div>
                        <small>VALID UNTIL:</small>
                        <span id="pass-expiry-date" style="color: #ff4757;">{{ formatDate(form.dateExpired) }}</span>
                    </div>
                </div>
                <div class="pass-id-box">
                    <small>PASS ID:</small>
                    <h2 id="pass-id">{{ passId }}</h2>
                </div>
            </div>
            <div class="pass-footer">
                <p>Present this Official Digital Pass to the waiter.</p>
            </div>
        </div>
    </div>

    <!-- DOWNLOAD BUTTON -->
    <button v-show="showPreview" @click="downloadPass" class="order-btn"
        style="background: #ffcc00; color: #000; margin-top: 20px; max-width: 400px;">
        <i class="fas fa-download"></i> Download Image
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import html2canvas from 'html2canvas'
import { useNotificationStore } from '@/store/notification'
import '@/assets/payment.css'

const notification = useNotificationStore()

const showPreview = ref(false)
const passId = ref('')
const captureArea = ref(null)

const form = reactive({
    custName: '',
    passType: 'Gold VIP Gift Card',
    dateCreated: '',
    dateExpired: ''
})

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const generatePreview = () => {
    if (!form.custName) {
        notification.error("Please enter a customer name")
        return
    }
    if (!form.dateCreated || !form.dateExpired) {
        notification.error("Please select both dates")
        return
    }
    
    passId.value = "#ASL-" + Math.floor(1000 + Math.random() * 9000)
    showPreview.value = true
    notification.info("Preview generated")
}

const downloadPass = () => {
    if (!captureArea.value) return

    html2canvas(captureArea.value, {
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a')
        link.download = `Aslan_Pass_${form.custName}.png`
        link.href = canvas.toDataURL()
        link.click()
    })
}

onMounted(() => {
    const today = new Date()
    const next6Months = new Date()
    next6Months.setMonth(today.getMonth() + 6)
    
    form.dateCreated = today.toISOString().split('T')[0]
    form.dateExpired = next6Months.toISOString().split('T')[0]
})
</script>

<style scoped>
.generator-page {
    background: #0f172a;
    color: #fff;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.generator-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 20px;
    max-width: 500px;
    width: 100%;
    border: 1px solid rgba(0, 255, 221, 0.2);
}

input,
select {
    width: 100%;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 1rem;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #00ffdd;
    font-weight: bold;
}

.order-btn {
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    border: none;
    background: #00ffdd;
    color: #0f172a;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.3s;
}

.order-btn:hover {
    background: #fff;
}

.pass-logo {
    height: 40px;
    filter: brightness(0) invert(1);
}
</style>
