const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("msg");

// ===== SIGNUP =====
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${window.API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Signup successful! Redirecting...", 'success');
        msg.style.color = "green";
        msg.innerText = "Signup successful! Redirecting...";
        setTimeout(() => window.location.href = "login.html", 1500);
      } else {
        showToast(data.msg, 'error');
        msg.style.color = "red";
        msg.innerText = data.msg;
      }
    } catch (err) {
      showToast("Server error", 'error');
      msg.style.color = "red";
      msg.innerText = "Server error";
    }
  });
}

// ===== LOGIN =====
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${window.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.msg || "Login failed", 'error');
        msg.style.color = "red";
        msg.innerText = data.msg || "Login failed";
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      showToast("Welcome back!", 'success');
      setTimeout(() => window.location.href = "dashboard.html", 800);
    } catch (err) {
      showToast("Server error", 'error');
      msg.style.color = "red";
      msg.innerText = "Server error";
    }
  });
}
