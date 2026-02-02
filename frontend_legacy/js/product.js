const catLinks = document.querySelectorAll(".cat-link");
const sections = document.querySelectorAll(".section-header");

// 1. ORDER BUTTON LOGIC
document.querySelectorAll(".order-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const productName = card.dataset.name;
    const productPrice = card.dataset.price;

    localStorage.setItem("orderName", productName);
    localStorage.setItem("orderPrice", productPrice);
    window.location.href = "payment.html";
  });
});

// 2. SCROLL SPY (Highlight active category)
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  catLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});
