// Ensure DOM is fully loaded before attaching listeners
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  console.log("Auth script ready 🚀");

  // ===== SIGNUP =====
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = signupForm.querySelector("button");
      const originalText = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${window.API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
        if (res.ok) {
          showToast("Signup successful! Redirecting...", 'success');
          setTimeout(() => window.location.href = "login.html", 1000);
        } else {
          showToast(data.msg || "Signup failed", 'error');
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      } catch (err) {
        showToast("Cannot reach server", 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const btn = loginForm.querySelector("button");
      if (btn.disabled) return; // Prevent double trigger

      const originalText = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Checking...';

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(`${window.API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await res.json();

        if (!res.ok) {
          showToast(data.msg || "Login failed", 'error');
          btn.disabled = false;
          btn.innerHTML = originalText;
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        btn.style.background = "#2ed573";
        btn.innerHTML = '<i class="fas fa-check"></i> Success!';

        showToast("Login Successful!", 'success');
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 10);

      } catch (err) {
        const errorMsg = err.name === 'AbortError' ? "Request timeout. Try again." : "Connection error.";
        showToast(errorMsg, 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }
});
