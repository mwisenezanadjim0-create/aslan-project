document.addEventListener("DOMContentLoaded", () => {
  const orderName = localStorage.getItem("orderName");
  const orderPrice = localStorage.getItem("orderPrice");

  const orderNameEl = document.getElementById("order-name");
  const orderPriceEl = document.getElementById("order-price");
  const confirmation = document.getElementById("confirmation");
  const payWithMomoBtn = document.getElementById("payWithMomo");
  const paidBtn = document.getElementById("paidBtn");

  if (!orderName || !orderPrice) {
    if (orderNameEl) orderNameEl.innerText = "No order";
    if (orderPriceEl) orderPriceEl.innerText = "0";
    return;
  }

  orderNameEl.innerText = orderName;
  orderPriceEl.innerText = orderPrice;

  // Disable Paid Button initially to guide user
  paidBtn.style.opacity = "0.5";
  paidBtn.style.pointerEvents = "none";

  // 1. TRIGGER USSD
  payWithMomoBtn.addEventListener("click", () => {
    const momoNumber = "0785975691";
    const ussdCode = `*182*1*1*${momoNumber}*${orderPrice}#`;

    // Attempt to open dialer
    window.location.href = `tel:${ussdCode}`;

    showToast(`USSD initiated! Please confirm the payment of ${orderPrice} RWF on your phone.`, 'success');

    // Enable the "I've Paid" button
    paidBtn.style.opacity = "1";
    paidBtn.style.pointerEvents = "auto";
    showToast("After paying, click 'I've Paid' to send your screenshot.", 'info');
  });

  // 2. CONFIRM PAYMENT & SEND WHATSAPP
  paidBtn.addEventListener("click", () => {
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();

    if (!name || !phone) {
      showToast("Please enter your name and phone number first!", 'error');
      return;
    }

    // Display confirmation on screen
    const minutes = Math.floor(Math.random() * 20) + 20;
    confirmation.innerHTML = `
      <div style="background: rgba(46, 213, 115, 0.2); color: #fff; padding: 20px; border-radius: 20px; border: 1px solid #2ed573; margin-top: 20px;">
        <h4 style="margin-bottom:10px;">✅ Order Submitted!</h4>
        Thank you, <b>${name}</b>. Your <b>${orderName}</b> will be delivered in <b>${minutes} minutes</b>.<br><br>
        <small><i>Redirecting to WhatsApp... Please send the screenshot there.</i></small>
      </div>
    `;

    // WhatsApp Message
    const message = `👋 Hello Aslan Café!\n\n` +
      `I've just paid for my order:\n` +
      `🍴 *Order:* ${orderName}\n` +
      `💰 *Amount:* ${orderPrice} RWF\n\n` +
      `👤 *My Name:* ${name}\n` +
      `📞 *My Phone:* ${phone}\n\n` +
      `📸 *I am sending the payment screenshot below...*`;

    const bossNumber = "250785975691";
    const encodedMsg = encodeURIComponent(message);

    // Redirect to WhatsApp
    setTimeout(() => {
      window.open(`https://wa.me/${bossNumber}?text=${encodedMsg}`, "_blank");
      
      // Clear order
      localStorage.removeItem("orderName");
      localStorage.removeItem("orderPrice");
    }, 1500);
  });
});
