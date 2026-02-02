<template>
  <footer class="main-footer" id="contact">
    <div class="footer-wave"></div>
    <div class="footer-container">
      <div class="footer-section brand-info">
        <h2 class="footer-logo dancing-script">Aslan Café</h2>
        <p class="tagline">Premium dining and fast delivery right to your doorstep. Experience the excellence of culinary art in every bite.</p>
        <div class="social-icons">
          <a href="#" class="social-link" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/aslan_cafe_luxe_resto/" target="_blank" class="social-link" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://wa.me/250785975691" target="_blank" class="social-link" aria-label="WhatsApp">
            <i class="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>

      <div class="footer-section links">
        <h3>Quick Links</h3>
        <ul>
          <li><RouterLink to="/"><i class="fas fa-chevron-right"></i> Home</RouterLink></li>
          <li><RouterLink to="/product"><i class="fas fa-chevron-right"></i> Products</RouterLink></li>
          <li><RouterLink to="/store"><i class="fas fa-chevron-right"></i> Our Store</RouterLink></li>
          <li><a href="#contact"><i class="fas fa-chevron-right"></i> Contact Us</a></li>
        </ul>
      </div>

      <div class="footer-section contact">
        <h3>Contact Us</h3>
        <div class="contact-item">
          <i class="fas fa-phone-alt"></i>
          <a href="tel:0785975691">0785975691</a>
        </div>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <a href="mailto:samdjiuwase@gmail.com">samdjiuwase@gmail.com</a>
        </div>
        <div class="promo-badge">
          <i class="fas fa-globe"></i> 
          <span>Contact us for websites!</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="bottom-content">
        <p class="copyright">© 2026 Aslan Café. All Rights Reserved.</p>
        <p class="dev-credit">
          Developed with <i class="fas fa-heart pulse"></i> by 
          <span class="dev-names">Nadjim, Thierry & Danny</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.main-footer {
  background: linear-gradient(180deg, rgba(11, 15, 26, 0.95) 0%, rgba(5, 10, 20, 1) 100%);
  border-top: 1px solid rgba(0, 255, 221, 0.1);
  position: relative;
  padding: 80px 5% 30px;
  overflow: hidden;
}

.footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(0, 255, 221, 0.03) 50%, 
    transparent 100%
  );
  opacity: 0.5;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr;
  gap: 60px;
  position: relative;
  z-index: 2;
}

/* BRAND SECTION */
.footer-logo {
  font-size: 2.8rem;
  color: var(--primary);
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(0, 255, 221, 0.3);
}

.tagline {
  color: rgba(255, 255, 255, 0.6);
  max-width: 380px;
  margin-bottom: 30px;
  line-height: 1.7;
  font-size: 0.95rem;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  font-size: 1.1rem;
}

.social-link:hover {
  background: var(--primary);
  color: #0b0f1a;
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 255, 221, 0.4);
}

/* FOOTER SECTIONS */
.footer-section h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: #fff;
  font-weight: 700;
  position: relative;
  padding-bottom: 12px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 35px;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
}

/* LINKS */
.links ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.links a i {
  font-size: 0.7rem;
  color: var(--primary);
  opacity: 0;
  transition: opacity 0.3s;
}

.links a:hover {
  color: var(--primary);
  padding-left: 8px;
}

.links a:hover i {
  opacity: 1;
}

/* CONTACT */
.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.contact-item i {
  color: var(--primary);
  font-size: 1rem;
  width: 20px;
}

.contact-item a,
.contact-item span {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.contact-item a:hover {
  color: var(--primary);
}

.promo-badge {
  margin-top: 25px;
  padding: 10px 16px;
  background: rgba(0, 255, 221, 0.05);
  border: 1px solid rgba(0, 255, 221, 0.2);
  border-radius: 10px;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.promo-badge:hover {
  background: rgba(0, 255, 221, 0.1);
  transform: translateX(4px);
}

/* FOOTER BOTTOM */
.footer-bottom {
  margin-top: 60px;
  padding-top: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.copyright {
  font-weight: 500;
}

.dev-credit {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dev-credit .fa-heart {
  color: #ff007a;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.dev-names {
  color: var(--primary);
  font-weight: 700;
  margin-left: 4px;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 50px;
  }
  
  .brand-info {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .main-footer {
    padding: 60px 20px 25px;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .tagline {
    margin: 0 auto 30px;
  }

  .social-icons {
    justify-content: center;
  }

  .footer-section h3::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .links a {
    justify-content: center;
  }

  .contact-item {
    justify-content: center;
  }

  .promo-badge {
    display: inline-flex;
  }

  .bottom-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
