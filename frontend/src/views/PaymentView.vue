<template>
  <div class="payment-view">
    <CommentModal :isOpen="showCommentModal" @close="showCommentModal = false" />
    <header>
      <h1>Payment Page</h1>
      <RouterLink to="/product" class="back-btn">Back to Products</RouterLink>
    </header>

    <main class="cart-container">
      <div class="payment-card">
        <div class="payment-content-grid">
            <!-- LEFT PANEL: RECEIPT -->
            <div class="receipt-panel">
                <div class="receipt-outer" ref="receiptArea">
                    <div class="receipt-box pro-receipt">
                        <div class="receipt-header">
                            <h2 class="business-name">Aslan Café Luxe</h2>
                            <p class="business-address">KK 565 St, Gikondo, Kigali</p>
                            <p class="business-tel">Tel: +250 785 975 691</p>
                            <p class="business-extra">TIN: 130 985 621 | VAT: 18% Incl.</p>
                            
                            <div class="header-details">
                            <span>Order: <strong>#ASL-{{ orderId }}</strong></span>
                            <span>Date: <strong>{{ receiptDate }}</strong></span>
                            </div>
                        </div>

                        <div class="receipt-divider dy-dashed"></div>

                        <div class="receipt-table">
                            <div class="table-header">
                            <span class="col-qty">Qty</span>
                            <span class="col-desc">Description</span>
                            <span class="col-amt">Amount</span>
                            </div>
                            <div class="table-body">
                            <div v-for="item in cartStore.items" :key="item.id" class="table-row">
                                <span class="col-qty">{{ item.quantity }}</span>
                                <div class="col-desc">
                                <span class="item-name">{{ item.name }}</span>
                                <small class="unit-price">@ {{ item.price.toLocaleString() }} ea</small>
                                </div>
                                <span class="col-amt">{{ (item.price * item.quantity).toLocaleString() }}</span>
                            </div>
                            </div>
                        </div>

                        <div class="receipt-divider dy-dashed"></div>

                        <div class="receipt-summary">
                            <div class="summary-row">
                            <span>Subtotal (Net):</span>
                            <span>{{ (cartStore.totalPrice / 1.18).toLocaleString() }}</span>
                            </div>
                            <div class="summary-row">
                            <span>VAT @ 18%:</span>
                            <span>{{ (cartStore.totalPrice - (cartStore.totalPrice / 1.18)).toLocaleString() }}</span>
                            </div>
                            <div class="summary-row total-row">
                            <span>TOTAL (Incl. TAX):</span>
                            <span>{{ cartStore.totalPrice.toLocaleString() }} RWF</span>
                            </div>
                            <div class="summary-row paid-by">
                            <span>Paid by:</span>
                            <span>MoMo ({{ customerPhone || 'Pending' }})</span>
                            </div>
                        </div>

                        <div class="receipt-footer">
                            <p class="thanks-msg">Thank you for dining with us!</p>
                            <p class="opening-hours">Open: 07am - 11pm (Daily)</p>
                            <div class="barcode">|||| |||| |||| ||| |||</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT PANEL: ACTIONS -->
            <div class="action-panel">
                <div class="payment-header">
                    <i class="fas fa-wallet"></i>
                    <h2>Checkout</h2>
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

                <div v-if="paymentSuccess" class="tracking-section">
                    <div class="tracking-header">
                        <div class="success-icon">✅</div>
                        <h3>Payment Received!</h3>
                        <p>Your order is being processed by the kitchen.</p>
                    </div>

                    <!-- Vertical Timeline -->
                    <div class="tracking-timeline">
                        <div class="timeline-step active">
                            <div class="step-bubble"><i class="fas fa-check"></i></div>
                            <div class="step-info">
                                <h4>Order Confirmed</h4>
                                <p>We've received your payment proof.</p>
                            </div>
                        </div>

                        <div class="timeline-step active">
                            <div class="step-bubble pulse"><i class="fas fa-utensils"></i></div>
                            <div class="step-info">
                                <h4>Preparing in Kitchen</h4>
                                <p>Chef is working on your delicious meal.</p>
                            </div>
                            <div class="step-line"></div>
                        </div>

                        <div class="timeline-step">
                            <div class="step-bubble"><i class="fas fa-motorcycle"></i></div>
                            <div class="step-info">
                                <h4>Out for Delivery</h4>
                                <p>A rider will pick up your order soon.</p>
                            </div>
                            <div class="step-line"></div>
                        </div>

                        <div class="timeline-step">
                            <div class="step-bubble"><i class="fas fa-home"></i></div>
                            <div class="step-info">
                                <h4>Order Arrived</h4>
                                <p>Enjoy your meal from Aslan Café!</p>
                            </div>
                            <div class="step-line"></div>
                        </div>
                    </div>

                    <button @click="$router.push('/')" class="back-home-btn">Return to Home</button>
                </div>
            </div>
        </div> 
      </div>
    </main>

    <footer>
      <p style="font-size: 1rem; color: #fff; margin-bottom: 5px;">
        Questions about your order?
      </p>
      <a href="tel:250785975691" style="font-size: 1.2rem; color: var(--primary); text-decoration: none; font-weight: bold;">
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
import { useCartStore } from '@/store/cart'
import CommentModal from '@/components/CommentModal.vue'
import '@/assets/payment.css'

const cartStore = useCartStore()
const notification = useNotificationStore()
const router = useRouter()

const orderName = computed(() => {
  if (cartStore.items.length === 0) return 'No Items'
  if (cartStore.items.length === 1) return cartStore.items[0].name
  return `${cartStore.items[0].name} +${cartStore.items.length - 1} more`
})

const orderPrice = computed(() => cartStore.totalPrice)
const customerName = ref('')
const customerPhone = ref('')
const isLoading = ref(false)
const paymentSuccess = ref(false)
const showCommentModal = ref(false)
const receiptArea = ref(null)
const screenshotFile = ref(null)
const orderId = ref(Math.floor(1000 + Math.random() * 9000))

const bossNumber = "0785975691"
const ussdCode = computed(() => `*182*1*1*${bossNumber}*${orderPrice.value || 0}#`)

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

    try {
        // Generate PRO Receipt Blob
        const canvas = await html2canvas(receiptArea.value, {
            backgroundColor: '#ffffff',
            scale: 2
        })
        
        const receiptBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

        const formData = new FormData()
        formData.append('screenshot', screenshotFile.value)
        formData.append('receipt', receiptBlob, `Receipt_${orderId.value}.png`)
        formData.append('customerName', customerName.value)
        formData.append('phone', customerPhone.value)
        formData.append('orderName', orderName.value)
        formData.append('amount', orderPrice.value)
        formData.append('orderId', orderId.value)

        await axios.post('/api/momo/verify-screenshot', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        isLoading.value = false
        paymentSuccess.value = true
        notification.success("Proof sent successfully!")
        
        // Check for first 3 customers
        try {
            const { data } = await axios.get('/api/reviews/count')
            if (data.count < 3) {
                setTimeout(() => {
                    showCommentModal.value = true
                }, 1000)
            }
        } catch (err) {
            console.error("Failed to check review count", err)
        }
        
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
        backgroundColor: '#ffffff',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a')
        link.download = `Aslan_Receipt_${customerName.value || 'order'}.png`
        link.href = canvas.toDataURL()
        link.click()

        // Cleanup
        cartStore.clearCart()
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

.upload-section h3 { color: var(--primary); font-size: 1.1rem; margin-bottom: 10px; }
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

.file-input-label:hover { border-color: var(--primary); background: rgba(0, 255, 221, 0.05); }
.file-input-label.hasFile { border-color: var(--primary); border-style: solid; background: rgba(0, 255, 221, 0.1); }

.file-input-label i { font-size: 2rem; color: var(--primary); }
.file-input-label span { font-size: 0.9rem; font-weight: 600; }

.hidden-input { display: none; }

.verify-btn {
    width: 100%;
    background: var(--primary);
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

/* TRACKING STYLES */
.tracking-section {
    margin-top: 40px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 30px;
    padding: 40px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.tracking-header {
    text-align: center;
    margin-bottom: 40px;
}

.success-icon { font-size: 3.5rem; margin-bottom: 15px; }

.tracking-timeline {
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
    max-width: 400px;
    margin: 0 auto;
}

.timeline-step {
    display: flex;
    gap: 25px;
    align-items: center;
    position: relative;
    opacity: 0.3;
}

.timeline-step.active {
    opacity: 1;
}

.step-bubble {
    width: 60px;
    height: 60px;
    background: #1e293b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #fff;
    border: 3px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 2;
}

.active .step-bubble {
    background: var(--primary);
    color: var(--dark-bg);
    border-color: rgba(0, 255, 221, 0.3);
}

.step-line {
    position: absolute;
    left: 28px;
    top: 60px;
    width: 4px;
    height: 35px;
    background: rgba(255, 255, 255, 0.1);
}

.active .step-line {
    background: var(--primary);
}

.step-info h4 { font-size: 1.1rem; margin-bottom: 4px; }
.step-info p { font-size: 0.85rem; opacity: 0.6; }

@keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 221, 0.7); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(0, 255, 221, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 221, 0); }
}

.pulse { animation: pulse 2s infinite; }

.back-home-btn {
    width: 100%;
    margin-top: 50px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 18px;
    border-radius: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
}

.back-home-btn:hover { background: var(--primary); color: var(--dark-bg); }

footer { text-align: center; padding: 40px 20px; background: rgba(0,0,0,0.1); margin-top: auto; width: 100%; }
</style>
