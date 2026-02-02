<template>
  <div class="payment-view">
    <header>
      <h1>Payment Page</h1>
      <RouterLink to="/product" class="back-link">Back to Products</RouterLink>
    </header>

    <main class="cart-container">
      <div class="payment-card">
        <div class="payment-header">
          <i class="fas fa-wallet"></i>
          <h2>Checkout</h2>
        </div>

        <!-- Receipt Style Summary -->
        <div class="receipt-outer" ref="receiptArea">
            <div class="receipt-box">
              <div class="receipt-top">
                <h3>Aslan Café Luxe</h3>
                <p>{{ receiptDate }}</p>
              </div>
              <div class="receipt-divider"></div>
              <div class="receipt-body">
                  <div class="receipt-item">
                    <span>Item:</span>
                    <span style="font-weight: 800;">{{ orderName || 'No order' }}</span>
                  </div>
                  <div class="receipt-item">
                    <span>Customer:</span>
                    <span style="font-weight: 800;">{{ customerName || 'Pending' }}</span>
                  </div>
              </div>
              <div class="receipt-divider"></div>
              <div class="receipt-total">
                <span>TOTAL:</span>
                <span>{{ Number(orderPrice || 0).toLocaleString() }} <small>RWF</small></span>
              </div>
              <div class="receipt-footer">
                  <p>Order ID: #ASL-{{ Math.floor(1000 + Math.random() * 9000) }}</p>
                  <p>KK 565 St, Gikondo</p>
              </div>
            </div>
        </div>

        <button v-if="paymentSuccess" @click="downloadReceipt" class="download-receipt-btn">
            <i class="fas fa-file-download"></i> Save Final Receipt
        </button>

        <div v-if="!paymentSuccess" class="form-section">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input v-model="customerName" type="text" placeholder="Full Name">
          </div>
          <div class="input-group">
            <i class="fas fa-phone"></i>
            <input v-model="customerPhone" type="text" placeholder="MTN Phone Number (078...)">
          </div>
        </div>

        <div v-if="!paymentSuccess" class="payment-actions">
          <!-- USSD INSTRUCTIONS -->
          <div class="ussd-info">
             <h3>Step 1: Pay via MoMo</h3>
             <p>Dial this code on your phone to pay:</p>
             <div class="ussd-code" @click="copyUSSD">
                {{ ussdCode }}
                <i class="fas fa-copy"></i>
             </div>
             <a :href="'tel:' + ussdCode.replace(/#/g, '%23')" class="dial-btn">
                <i class="fas fa-phone-alt"></i> Dial Automatically
             </a>
          </div>

          <div class="divider"><span>AND THEN</span></div>

          <!-- SCREENSHOT UPLOAD -->
          <div class="upload-section">
             <h3>Step 2: Upload Proof</h3>
             <p>Take a screenshot of your MoMo confirmation message and upload it here.</p>
             
             <label class="file-input-label" :class="{ hasFile: screenshotFile }">
                <i v-if="!screenshotFile" class="fas fa-cloud-upload-alt"></i>
                <i v-else class="fas fa-check-circle"></i>
                <span>{{ screenshotFile ? screenshotFile.name : 'Choose Screenshot' }}</span>
                <input type="file" @change="handleFileChange" accept="image/*" class="hidden-input">
             </label>

             <button 
               @click="handleVerification" 
               class="verify-btn" 
               :disabled="isLoading || !screenshotFile || !customerName"
             >
                <i v-if="isLoading" class="fas fa-circle-notch fa-spin"></i>
                <span v-else><i class="fas fa-paper-plane"></i> Send proof to Boss (Auto)</span>
             </button>

             <div class="divider"><span>OR</span></div>

             <button @click="verifyOnWhatsApp" class="wa-direct-btn">
                <i class="fab fa-whatsapp"></i> Send via my WhatsApp app
             </button>
          </div>
        </div>

        <div v-if="paymentSuccess" class="success-card">
          <div style="font-size: 3rem; margin-bottom: 15px;">✅</div>
          <h4 style="font-size: 1.4rem; margin-bottom: 10px;">Proof Submitted!</h4>
          <p style="opacity: 0.8; font-size: 0.95rem;">
            Thanks <b>{{ customerName }}</b>! Your payment screenshot has been sent to our Boss. <br>
            Please wait a moment while they verify it.
          </p>
        </div>
      </div>
    </main>

    <footer>
      <p style="font-size: 1rem; color: #fff; margin-bottom: 5px;">
        Questions about your order?
      </p>
      <a href="tel:250785975691" style="font-size: 1.2rem; color: #00ffdd; text-decoration: none; font-weight: bold;">
        <i class="fas fa-phone-alt"></i> 0785975691
      </a>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import html2canvas from 'html2canvas'
import { useNotificationStore } from '@/store/notification'
import '@/assets/payment.css'

const notification = useNotificationStore()
const router = useRouter()

const orderName = ref(localStorage.getItem('orderName'))
const orderPrice = ref(localStorage.getItem('orderPrice'))
const customerName = ref('')
const customerPhone = ref('')
const isLoading = ref(false)
const paymentSuccess = ref(false)
const receiptArea = ref(null)
const screenshotFile = ref(null)

const bossNumber = "0785975691"
const ussdCode = computed(() => `*181*1*1*${bossNumber}*${orderPrice.value || 0}#`)

const receiptDate = computed(() => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
})

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        screenshotFile.value = file
        notification.success("Screenshot attached!")
    }
}

const copyUSSD = () => {
    navigator.clipboard.writeText(ussdCode.value)
    notification.info("USSD Code copied to clipboard!")
}

const handleVerification = async () => {
    if (!customerName.value || !screenshotFile.value) {
        notification.error("Please provide your name and the screenshot")
        return
    }

    isLoading.value = true
    notification.info("Sending proof to Boss... Please wait.")

    const formData = new FormData()
    formData.append('screenshot', screenshotFile.value)
    formData.append('customerName', customerName.value)
    formData.append('phone', customerPhone.value)
    formData.append('orderName', orderName.value)
    formData.append('amount', orderPrice.value)

    try {
        await axios.post('/api/momo/verify-screenshot', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        isLoading.value = false
        paymentSuccess.value = true
        notification.success("Proof sent successfully!")
        
    } catch (err) {
        console.error(err)
        notification.error(err.response?.data?.msg || "Failed to send screenshot. Please try again.")
        isLoading.value = false
    }
}

const verifyOnWhatsApp = () => {
    if (!customerName.value) {
        notification.error("Please enter your name first")
        return
    }

    const message = `👋 *New Payment Proof Received*\n\n` +
                    `👤 *Customer:* ${customerName.value}\n` +
                    `📞 *Phone:* ${customerPhone.value}\n` +
                    `💵 *Amount:* ${Number(orderPrice.value).toLocaleString()} RWF\n\n` +
                    `_I am attaching my screenshot proof right now!_`;
                    
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${bossNumber}?text=${encoded}`, "_blank")
}

const downloadReceipt = () => {
    if (!receiptArea.value) return

    html2canvas(receiptArea.value, {
        backgroundColor: '#0f172a',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a')
        link.download = `Aslan_Receipt_${customerName.value || 'order'}.png`
        link.href = canvas.toDataURL()
        link.click()

        // Cleanup
        localStorage.removeItem("orderName")
        localStorage.removeItem("orderPrice")
    })
}

onMounted(() => {
    if (!orderName.value || !orderPrice.value) {
        // router.push('/product')
    }
})
</script>

<style scoped>
.payment-view {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

header { width: 100%; }

.ussd-info {
    background: rgba(255, 204, 0, 0.1);
    border: 1px solid rgba(255, 204, 0, 0.3);
    padding: 20px;
    border-radius: 24px;
    text-align: center;
    margin-bottom: 20px;
}

.ussd-info h3 { color: #ffcc00; font-size: 1.1rem; margin-bottom: 10px; }
.ussd-info p { font-size: 0.9rem; opacity: 0.7; margin-bottom: 15px; }

.ussd-code {
    background: #000;
    color: #ffcc00;
    padding: 15px;
    border-radius: 12px;
    font-family: monospace;
    font-size: 1.3rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    border: 1px solid #ffcc00;
}

.dial-btn {
    display: inline-block;
    margin-top: 15px;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    font-size: 0.85rem;
    padding: 8px 16px;
    background: rgba(255,255,255,0.1);
    border-radius: 50px;
}

.divider {
    text-align: center;
    position: relative;
    margin: 25px 0;
}
.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.1);
}
.divider span {
    position: relative;
    background: #1e293b;
    padding: 0 15px;
    color: rgba(255,255,255,0.4);
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 2px;
}

.upload-section {
    background: rgba(0, 255, 221, 0.05);
    border: 1px solid rgba(0, 255, 221, 0.2);
    padding: 20px;
    border-radius: 24px;
    text-align: center;
}

.upload-section h3 { color: #00ffdd; font-size: 1.1rem; margin-bottom: 10px; }
.upload-section p { font-size: 0.9rem; opacity: 0.7; margin-bottom: 20px; }

.file-input-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 30px;
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s;
    margin-bottom: 20px;
}

.file-input-label:hover { border-color: #00ffdd; background: rgba(0, 255, 221, 0.05); }
.file-input-label.hasFile { border-color: #00ffdd; border-style: solid; background: rgba(0, 255, 221, 0.1); }

.file-input-label i { font-size: 2rem; color: #00ffdd; }
.file-input-label span { font-size: 0.9rem; font-weight: 600; }

.hidden-input { display: none; }

.verify-btn {
    width: 100%;
    background: #00ffdd;
    color: #0f172a;
    height: 60px;
    border-radius: 20px;
    font-weight: 800;
    font-size: 1.1rem;
    border: none;
    cursor: pointer;
    transition: 0.3s;
}

.verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.wa-direct-btn {
    width: 100%;
    background: #25D366;
    color: #fff;
    height: 55px;
    border-radius: 20px;
    font-weight: 800;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.wa-direct-btn:hover { background: #1eb956; transform: translateY(-3px); }

.success-card {
    background: rgba(0, 255, 221, 0.1); 
    color: #fff; padding: 30px; border-radius: 24px; border: 1px solid rgba(0, 255, 221, 0.3); margin-top: 30px; text-align: center;
}

.receipt-box { margin-bottom: 35px; }
footer { text-align: center; padding: 40px 20px; background: rgba(0,0,0,0.1); margin-top: auto; width: 100%; }
</style>
