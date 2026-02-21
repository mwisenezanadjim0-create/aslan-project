<template>
  <div class="generator-page">
    <h1>🔒 Admin Pass Generator</h1>
    <p style="opacity: 0.7; margin-bottom: 20px;">Generate Digital Passes for confirmed WhatsApp payments.</p>
    <RouterLink to="/dashboard" style="color: var(--primary); text-decoration: none; margin-bottom: 30px; display: inline-block;">
        <i class="fas fa-arrow-left"></i> Back to Dashboard
    </RouterLink>

    <div class="generator-card">
        <label>Customer Name</label>
        <input v-model="form.custName" type="text" placeholder="e.g. Nadjim">

        <label>Pass Type / Item</label>
        <select v-model="form.passType">
            <option value="Gold Ramadhan Pass">Gold Ramadhan Pass (30k)</option>
            <option value="Premium Ramadhan Card">Premium Ramadhan Card (20k)</option>
            <option value="Silver Ramadhan Card">Silver Ramadhan Card (10k)</option>
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

        <div style="margin-bottom: 20px;">
            <label>Card Theme</label>
            <div class="theme-selector">
                <button 
                    @click="form.theme = 'standard'" 
                    :class="{ active: form.theme === 'standard' }"
                    class="theme-btn"
                >Standard</button>
                <button 
                    @click="form.theme = 'ramadan'" 
                    :class="{ active: form.theme === 'ramadan' }"
                    class="theme-btn"
                >🌙 Ramadan</button>
                <button 
                    @click="form.theme = 'valentine'" 
                    :class="{ active: form.theme === 'valentine' }"
                    class="theme-btn"
                >💕 Valentine</button>
            </div>
            
            <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" v-model="form.socialMode" id="socialMode" style="width: auto; margin-bottom: 0;">
                <label for="socialMode" style="margin-bottom: 0;">Social Media Post Mode (Logo & Address)</label>
            </div>
        </div>

        <button @click="generatePreview" class="order-btn">🔄 Generate Preview</button>
    </div>

    <!-- PREVIEW AREA -->
    <div v-show="showPreview" id="digital-pass-container" style="max-width: 400px; margin-top: 30px;">
        <div 
            class="digital-pass" 
            :class="[
                { 'valentine-theme': form.theme === 'valentine' },
                { 'ramadan-theme': form.theme === 'ramadan' },
                { 'gold-tier': form.passType.includes('Gold') },
                { 'premium-tier': form.passType.includes('Premium') },
                { 'silver-tier': form.passType.includes('Silver') }
            ]"
            ref="captureArea"
        >
            <div class="pass-header">
                <span class="pass-type">
                    {{ form.theme === 'valentine' ? 'HAPPY VALENTINE\'S DAY' : 
                       form.theme === 'ramadan' ? 'RAMADHAN KAREEM' : 'OFFICIAL PASS' }}
                </span>
                <img src="@/assets/img/2.png" alt="Logo" class="pass-logo">
            </div>
            <div class="pass-body">
                <div v-if="form.theme === 'valentine'" class="valentine-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <div v-if="form.theme === 'ramadan'" class="ramadan-icon">
                    <i v-if="form.passType.includes('Gold')" class="fas fa-crown"></i>
                    <i v-else-if="form.passType.includes('Premium')" class="fas fa-star-and-crescent"></i>
                    <i v-else class="fas fa-moon"></i>
                </div>
                <h3 id="pass-item-name">{{ form.passType }}</h3>
                <p class="pass-desc">{{ descriptions[form.passType] }}</p>
                <p class="pass-owner">Gift for: <span id="pass-customer-name">{{ form.custName }}</span></p>
                
                <p v-if="form.theme === 'valentine'" class="valentine-msg">
                    Celebrate love with a special dining experience at Aslan Café.
                </p>

                <div class="pass-dates">
                    <div>
                        <small>ISSUED:</small>
                        <span id="pass-issue-date">{{ formatDate(form.dateCreated) }}</span>
                    </div>
                    <div>
                        <small>VALID UNTIL:</small>
                        <span id="pass-expiry-date" :style="{ color: form.theme === 'valentine' ? '#ff69b4' : '#ff4757' }">{{ formatDate(form.dateExpired) }}</span>
                    </div>
                </div>
                <div class="pass-id-box">
                    <small>PASS ID:</small>
                    <h2 id="pass-id">{{ passId }}</h2>
                </div>
            </div>
            <div class="pass-footer">
                <p v-if="form.theme === 'valentine'">Valid for Romantic Dinners at Aslan Café.</p>
                <p v-else-if="form.theme === 'ramadan'">Valid for Iftar Experiences at Aslan Café.</p>
                <p v-else>Present this Official Digital Pass to the waiter.</p>
                
                <!-- Social Media Branding -->
                <div v-if="form.socialMode" class="social-branding">
                    <div class="branding-divider"></div>
                    <div class="branding-info">
                        <span><i class="fas fa-map-marker-alt"></i> Kigali, Rwanda</span>
                        <span><i class="fab fa-instagram"></i> @aslancafekgl</span>
                    </div>
                </div>
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
    passType: 'Valentine\'s Day Gift Card',
    theme: 'valentine',
    dateCreated: '',
    dateExpired: ''
})

const descriptions = {
    'Gold Ramadhan Pass': 'Royal Iftar: Signature Master Plate (Fish/Chicken) + Full Appetizers & Special Drinks.',
    'Premium Ramadhan Card': 'Elite Iftar: Full Individual Iftar Meal including Starters, Main Course & Refreshment.',
    'Silver Ramadhan Card': 'Moonlight Special: Perfect for a light Iftar snack, Coffee & Deluxe Dessert.',
    'Gold VIP Gift Card': 'VIP Experience: Aslan Master Plate, Family Platters, or Full 3-Course Dinner.',
    'Platinum Elite Card': 'All-inclusive premium feast designed for large groups (8-10 Pax).',
    'Birthday Party Package': 'Complete Celebration for 8-10 people. Includes Cake & Decorations.',
    "Couple's Dinner Night": 'A romantic 3-course meal for two with decorative setting.',
    'Family Feast': 'A massive platter for 4-5 people. Grilled meats, sides, and drinks.'
}

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
        scale: 2,
        useCORS: true 
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
    color: var(--primary);
    font-weight: bold;
}

.theme-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.theme-btn {
    flex: 1;
    padding: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.theme-btn.active {
    background: var(--primary);
    color: #000;
    border-color: var(--primary);
}

.order-btn {
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    border: none;
    background: var(--primary);
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
    opacity: 0.8;
}

/* RAMADAN THEME STYLES */
.ramadan-theme {
    background: radial-gradient(circle at center, #0a2f23 0%, #031811 100%) !important;
    border: 2px solid #ffd700 !important;
    box-shadow: 0 0 50px rgba(0, 255, 100, 0.2);
}

.ramadan-theme .pass-header {
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid #ffd700;
}

.ramadan-theme .pass-type {
    color: #ffd700;
    font-family: 'Dancing Script', cursive;
    font-size: 1.5rem;
    letter-spacing: 1px;
    font-weight: bold;
}

.ramadan-theme .pass-body {
    background: transparent;
}

.ramadan-theme .ramadan-icon {
    font-size: 3rem;
    color: #ffd700;
    margin-bottom: 10px;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
}

.ramadan-theme h3 {
    font-family: 'Playfair Display', serif;
    color: #fff;
    font-size: 2rem;
    margin-bottom: 5px;
}

.ramadan-theme .pass-owner span {
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.ramadan-theme .ramadan-msg {
    font-style: italic;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    margin: 15px 0;
    line-height: 1.4;
}

.ramadan-theme .pass-dates {
    border-color: rgba(255, 215, 0, 0.3);
    background: rgba(0,0,0,0.4);
}

.ramadan-theme .pass-id-box {
    border-color: rgba(255, 215, 0, 0.3);
    background: rgba(255, 215, 0, 0.05);
}

.ramadan-theme .pass-id-box h2 {
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* RAMADAN TIER VARIATIONS */
.ramadan-theme.premium-tier {
    background: radial-gradient(circle at center, #0a1b2f 0%, #030a18 100%) !important;
    border: 2px solid #c0c0c0 !important;
}

.ramadan-theme.premium-tier .pass-type,
.ramadan-theme.premium-tier .ramadan-icon,
.ramadan-theme.premium-tier .pass-owner span,
.ramadan-theme.premium-tier .pass-id-box h2,
.ramadan-theme.premium-tier .pass-desc {
    color: #00e5ff;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.ramadan-theme.silver-tier {
    background: radial-gradient(circle at center, #2f2f2f 0%, #151515 100%) !important;
    border: 2px solid #a8a8a8 !important;
}

.ramadan-theme.silver-tier .pass-type,
.ramadan-theme.silver-tier .ramadan-icon,
.ramadan-theme.silver-tier .pass-owner span,
.ramadan-theme.silver-tier .pass-id-box h2,
.ramadan-theme.silver-tier .pass-desc {
    color: #e0e0e0;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

/* SOCIAL MODE BRANDING */
.social-branding {
    margin-top: 15px;
    width: 100%;
}

.branding-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
    margin-bottom: 10px;
}

.branding-info {
    display: flex;
    justify-content: space-around;
    font-size: 0.75rem;
    opacity: 0.7;
    font-weight: 500;
}

.branding-info i {
    color: var(--primary);
    margin-right: 5px;
}

.pass-desc {
    color: #fff;
    opacity: 0.9;
    font-size: 0.95rem;
    margin: 10px 0;
    line-height: 1.4;
    font-style: italic;
    background: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 8px;
}

.ramadan-theme .pass-desc {
    color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    border: 1px dashed rgba(255, 215, 0, 0.3);
}

/* VALENTINE'S DAY THEME STYLES */
.valentine-theme {
    background: radial-gradient(circle at center, #4a0e1f 0%, #1a0509 100%) !important;
    border: 2px solid #ff69b4 !important;
    box-shadow: 0 0 50px rgba(255, 105, 180, 0.3);
}

.valentine-theme .pass-header {
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid #ff69b4;
}

.valentine-theme .pass-type {
    color: #ff69b4;
    font-family: 'Dancing Script', cursive;
    font-size: 1.5rem;
    letter-spacing: 1px;
    font-weight: bold;
}

.valentine-theme .pass-body {
    background: transparent;
}

.valentine-theme .valentine-icon {
    font-size: 3rem;
    color: #ff1493;
    margin-bottom: 10px;
    filter: drop-shadow(0 0 15px rgba(255, 20, 147, 0.5));
    animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.valentine-theme h3 {
    font-family: 'Playfair Display', serif;
    color: #fff;
    font-size: 2rem;
    margin-bottom: 5px;
}

.valentine-theme .pass-owner span {
    color: #ff69b4;
    text-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
}

.valentine-theme .valentine-msg {
    font-style: italic;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    margin: 15px 0;
    line-height: 1.4;
}

.valentine-theme .pass-dates {
    border-color: rgba(255, 105, 180, 0.3);
    background: rgba(0,0,0,0.4);
}

.valentine-theme .pass-id-box {
    border-color: rgba(255, 105, 180, 0.3);
    background: rgba(255, 105, 180, 0.05);
}

.valentine-theme .pass-id-box h2 {
    color: #ff69b4;
    text-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
}

.valentine-theme .pass-desc {
    color: #ff69b4;
    background: rgba(255, 105, 180, 0.1);
    border: 1px dashed rgba(255, 105, 180, 0.3);
}
</style>
