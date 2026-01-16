// Restaurant Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');

    // Smooth scroll for nav background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
            nav.style.padding = '15px 5%';
        } else {
            nav.style.background = 'rgba(15, 23, 42, 0.8)';
            nav.style.padding = '20px 5%';
        }
    });

    console.log("Aslan Restaurant Page Loaded ✅");
});
