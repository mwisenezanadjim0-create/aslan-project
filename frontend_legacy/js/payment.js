document.addEventListener("DOMContentLoaded", () => {
  const orderName = localStorage.getItem("orderName");
  const orderPrice = localStorage.getItem("orderPrice");

  const orderNameEl = document.getElementById("order-name");
  const orderPriceEl = document.getElementById("order-price");
  const receiptDateEl = document.getElementById("receipt-date");
  const confirmation = document.getElementById("confirmation");

  const customerNameInput = document.getElementById("customerName");
  const customerPhoneInput = document.getElementById("customerPhone");

  const orderActionBtn = document.getElementById("orderActionBtn");
  const loadingSpinner = document.getElementById("loadingSpinner");

  let isPaid = false;

  // Set Today's Date on Receipt
  if (receiptDateEl) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    receiptDateEl.innerText = new Date().toLocaleDateString('en-US', options);
  }

  if (!orderName || !orderPrice) {
    if (orderNameEl) orderNameEl.innerText = "No order";
    if (orderPriceEl) orderPriceEl.innerText = "0";
    // Optional: Redirect back if no order
  } else {
    orderNameEl.innerText = orderName;
    orderPriceEl.innerText = orderPrice;
  }

  // Handle Button Click
  if (orderActionBtn) {
    orderActionBtn.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
        <img src="images/Screenshot 2026-01-17 113818.png" style="height: 25px;" alt="MTN">
        <span>Pay with MoMo</span>
      </div>
    `;
    orderActionBtn.style.background = "#ffcc00"; // MOMO Yellow
    orderActionBtn.style.color = "#000";

    orderActionBtn.addEventListener("click", () => {
      const name = customerNameInput.value.trim();
      const phone = customerPhoneInput.value.trim();

      if (!name || !phone) {
        showToast("Please enter your Name and Phone Number first.", 'error');
        return;
      }

      if (!isPaid) {
        // STEP 1: TRIGGER USSD
        const merchantPhone = "0785975691";
        const ussdCode = `*182*1*1*${merchantPhone}*${orderPrice}#`;

        window.location.href = `tel:${ussdCode}`;

        // Change button state to confirmation
        orderActionBtn.innerHTML = `
           <i class="fas fa-check-circle"></i> I have entered PIN
        `;
        orderActionBtn.style.background = "#00ffdd";
        orderActionBtn.style.color = "#0f172a";
        isPaid = true;

        showToast("Check your phone dialer! Press CALL to pay.", 'info');

      } else {
        // STEP 2: SHOW SUCCESS & WHATSAPP
        showSuccessMessage(name, orderName, orderPrice);
        sendToWhatsApp(name, phone, orderName, orderPrice);
        orderActionBtn.style.display = "none";
      }
    });
  }

  function showSuccessMessage(name, item, price) {
    const minutes = Math.floor(Math.random() * 20) + 20;

    // HIDE PASS GENERATION FOR USER (Boss will generate it manually)
    const digitalPassContainer = document.getElementById("digital-pass-container");
    if (digitalPassContainer) digitalPassContainer.style.display = "none";

    confirmation.innerHTML = `
      <div class="success-card" style="
        background: rgba(0, 255, 221, 0.1); 
        color: #fff; 
        padding: 30px; 
        border-radius: 24px; 
        border: 1px solid rgba(0, 255, 221, 0.3); 
        margin-top: 30px; 
        text-align: center;
        animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      ">
        <div style="font-size: 3rem; margin-bottom: 15px;">⏳</div>
        <h4 style="font-size: 1.4rem; margin-bottom: 10px;">Payment Verification</h4>
        <p style="opacity: 0.8; font-size: 0.95rem;">
          Thanks <b>${name}</b>! <br>
          Please send your <b>Payment Screenshot</b> on WhatsApp to receive your Official Digital Pass.
        </p>
        <div style="margin-top: 20px; font-size: 0.8rem; color: #00ffdd;">
          <i class="fab fa-whatsapp"></i> Opening WhatsApp...
        </div>
      </div>
      <style>
        @keyframes successPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;
  }

  function sendToWhatsApp(name, phone, item, price) {
    const message = `👋 *NEW ORDER PAID (Via USSD)*\n\n` +
      `✅ *Customer Status:* "I have entered my PIN"\n` +
      `👤 *Customer:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `--------------------------------\n` +
      `🍴 *Item:* ${item}\n` +
      `💰 *Amount:* ${price} RWF\n` +
      `--------------------------------\n` +
      `PLEASE VERIFY PAYMENT MSG ON YOUR PHONE.`;

    const bossNumber = "250785975691";
    const encodedMsg = encodeURIComponent(message);

    setTimeout(() => {
      window.open(`https://wa.me/${bossNumber}?text=${encodedMsg}`, "_blank");

      localStorage.removeItem("orderName");
      localStorage.removeItem("orderPrice");
    }, 1500);
  }
});
