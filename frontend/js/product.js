document.querySelectorAll(".order-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const productName = card.dataset.name;
    const productPrice = card.dataset.price;

    // Save order in localStorage
    localStorage.setItem("orderName", productName);
    localStorage.setItem("orderPrice", productPrice);

    // Redirect to payment page
    window.location.href = "payment.html";
  });
});
