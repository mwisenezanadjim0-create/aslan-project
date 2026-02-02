console.log("Dashboard script initializing...");

// Helper to check auth status with a small grace period
async function checkAuth() {
  let initialToken = localStorage.getItem("token");

  if (!initialToken || initialToken === "undefined" || initialToken === "null") {
    console.log("Token not immediately found, waiting for sync...");
    await new Promise(r => setTimeout(r, 100));
    initialToken = localStorage.getItem("token");

    if (!initialToken || initialToken === "undefined" || initialToken === "null") {
      window.location.href = "login.html";
      return false;
    }
  }
  return true;
}

const section = document.getElementById("section");
const welcome = document.getElementById("welcome");
const token = localStorage.getItem("token"); // For global use

// ================= SIDEBAR ACTIVE STATE =================
function setActiveButton(name) {
  document.querySelectorAll(".sidebar button[data-section]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.section === name);
  });
}

// ================= LOAD CURRENT USER =================
async function loadUser() {
  if (!token) return; // Already handled at top

  try {
    const res = await fetch(`${window.API_BASE_URL}/dashboard/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("Session invalid (401/403). Cleaning up and redirecting...");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const data = await res.json();
    welcome.innerHTML = `Welcome back, <span style="color:#00ffdd; font-weight:600;">${data.username}</span>`;
  } catch (err) {
    console.error("Dashboard User Load Error:", err);
    welcome.innerHTML = `<span style="color:#ff4757; font-size:1.2rem;"><i class="fas fa-exclamation-triangle"></i> Connection Error: Backend Unreachable</span>`;
    showToast("Cannot connect to server. Is the backend running?", 'error');
  }
}

// ================= LOGOUT =================
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
};

// ================= SIDEBAR =================
function setupSidebar(role) {
  const sidebarNav = document.querySelector(".sidebar-nav");

  // Check if staff button already exists
  if (role === 'admin' || role === 'boss') {
    if (!document.querySelector('button[data-section="staff"]')) {
      const staffBtn = document.createElement("button");
      staffBtn.dataset.section = "staff";
      staffBtn.innerHTML = '<i class="fas fa-users"></i> Staff Tracking';
      // Insert before logout or at the end of nav
      sidebarNav.appendChild(staffBtn);
    }
  }

  document.querySelectorAll(".sidebar button[data-section]").forEach(btn => {
    btn.onclick = () => loadSection(btn.dataset.section);
  });
}

// ================= LOAD SECTIONS =================
async function loadSection(name) {
  setActiveButton(name);
  section.innerHTML = `<div class="loading">Loading ${name}...</div>`;

  switch (name) {
    case "home": return loadHome();
    case "stock": return loadStock();
    case "daily": return loadDaily();
    case "marketing": return loadMarketing();
    case "orders": return loadOrders();
    case "staff": return loadStaff();
  }
}

// ================= HOME / SUMMARY =================
async function loadHome() {
  const res = await fetch(`${window.API_BASE_URL}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  const stats = data.stats || { allTime: 0 };
  const role = data.role || 'staff';
  const isAdmin = role === 'admin' || role === 'boss';

  // Badge only shows for Admin/Boss (Managers look like regular staff now)
  const roleBadge = isAdmin ? `<span class="badge" style="background:#00ffdd; color:#000; padding:2px 10px; border-radius:12px; font-size:0.7rem; margin-top:5px; display:inline-block; font-weight:600;">${role.toUpperCase()} ACCOUNT</span>` : '';

  section.innerHTML = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <h3 style="margin-bottom:20px;"><i class="fas fa-chart-pie"></i> Business Overview ${isDevServer ? '(DEV)' : ''}</h3>
          <div style="text-align:right;">
            ${roleBadge}<br>
            <span style="font-size:0.8rem; opacity:0.7;">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <h4>${!isAdmin ? 'My Stock Items' : 'Total Stock Items'}</h4>
            <div class="stat-value">${data.stockCount}</div>
          </div>
          <div class="stat-item">
            <h4>${!isAdmin ? 'My Reports' : 'Total Staff Reports'}</h4>
            <div class="stat-value">${data.dailyCount}</div>
          </div>
          <div class="stat-item">
            <h4>${!isAdmin ? 'My Expenses' : 'Total Expenses'}</h4>
            <div class="stat-value">${data.marketingCount}</div>
          </div>
        </div>
      </div>

      <div class="glass-card" style="margin-top:20px;">
        <h3 style="margin-bottom:20px; color:#00ffdd;"><i class="fas fa-coins"></i> Financial Performance</h3>
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <div class="stat-item" style="border-left: 3px solid #00ffdd;">
            <h4>Today <small style="font-size:0.6rem; display:block; opacity:0.5;">(${data.todayDate || 'Current Day'})</small></h4>
            <div class="stat-value" style="font-size:1.4rem; color:#00ffdd;">${(stats.today || 0).toLocaleString()} <small>RWF</small></div>
          </div>
          <div class="stat-item">
            <h4>This Week</h4>
            <div class="stat-value" style="font-size:1.2rem; color:#00ffdd;">${(stats.thisWeek || 0).toLocaleString()} <small>RWF</small></div>
          </div>
          <div class="stat-item">
            <h4>This Month</h4>
            <div class="stat-value" style="font-size:1.2rem; color:#00ffdd;">${(stats.thisMonth || 0).toLocaleString()} <small>RWF</small></div>
          </div>
          <div class="stat-item">
            <h4>This Year</h4>
            <div class="stat-value" style="font-size:1.2rem; color:#00ffdd;">${(stats.thisYear || 0).toLocaleString()} <small>RWF</small></div>
          </div>
        </div>
        <div class="stat-item" style="margin-top:20px; text-align:center; border-top: 1px solid rgba(255,255,255,0.1); padding-top:20px;">
            <h4>${!isAdmin ? 'My Total Revenue' : 'Company Total Revenue'}</h4>
            <div class="stat-value" style="font-weight:700; color:#00ffdd; font-size:1.8rem;">${stats.allTime.toLocaleString()} <small>RWF</small></div>
        </div>
      </div>
    `;

  // Only setup sidebar once we know the role
  setupSidebar(role);
}

// ================= STOCK =================
async function loadStock() {
  const res = await fetch(`${window.API_BASE_URL}/dashboard/stock`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return showToast("Failed to load stock", 'error');
  const stock = await res.json();

  section.innerHTML = `
    <div class="glass-card">
      <h3>Inventory Management</h3>
      <div class="input-group">
        <input id="item" type="text" placeholder="Item Name (e.g. Flour, Sugar)">
        <input id="qty" type="number" placeholder="Quantity">
      </div>
      <button id="addStockBtn" class="action-btn"><i class="fas fa-plus"></i> Add to Stock</button>
      
      <div style="margin-top: 30px;">
        <h4>Current Inventory</h4>
        <ul id="stockList">
          ${stock.length === 0 ? '<li style="opacity:0.5; justify-content:center;">No items in stock</li>' : ''}
        </ul>
      </div>
    </div>
  `;

  const stockList = document.getElementById("stockList");
  stock.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${s.item}</strong> (Qty: ${s.qty})</span>
      <button data-id="${s._id}" class="remove-btn"><i class="fas fa-trash"></i></button>
    `;
    stockList.appendChild(li);
  });

  document.getElementById("addStockBtn").onclick = async () => {
    const item = document.getElementById("item").value;
    const qty = Number(document.getElementById("qty").value);
    if (!item || qty <= 0) return showToast("Invalid input", 'error');

    const res = await fetch(`${window.API_BASE_URL}/dashboard/stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ item, qty })
    });

    if (!res.ok) {
      const data = await res.json();
      return showToast(data.msg || "Failed to add stock", 'error');
    }

    loadStock();
  };

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = async () => {
      await fetch(`${window.API_BASE_URL}/dashboard/stock/${btn.dataset.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      loadStock();
    };
  });
}

// ================= DAILY =================
async function loadDaily() {
  const res = await fetch(`${window.API_BASE_URL}/dashboard/daily`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return showToast("Failed to load daily data", 'error');
  const daily = await res.json();

  section.innerHTML = `
    <div class="glass-card">
      <h3>Revenue Tracking</h3>
      <div class="input-group">
        <input id="date" type="date" value="${new Date().toISOString().split('T')[0]}">
        <input id="amount" type="number" placeholder="Total Income (RWF)">
      </div>
      <button id="addDailyBtn" class="action-btn"><i class="fas fa-save"></i> Save Transaction</button>
      
      <div style="margin-top: 40px; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px;">
        <h4 style="margin-bottom:15px; font-size:0.9rem; opacity:0.8;">Recent Revenue Trends</h4>
        <canvas id="dailyChart"></canvas>
      </div>

      <div style="margin-top: 30px;">
        <h4>Transaction History</h4>
        <div style="max-height: 300px; overflow-y: auto; margin-top: 15px;">
          <table style="width: 100%; border-collapse: collapse; color: #fff;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid rgba(255,255,255,0.1);">
                <th style="padding: 10px;">Date</th>
                <th style="padding: 10px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${daily.slice().reverse().map(d => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 10px; opacity: 0.8;">${d.date}</td>
                  <td style="padding: 10px; font-weight: 600;">${Number(d.amount).toLocaleString()} RWF</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const saveBtn = document.getElementById("addDailyBtn");
  saveBtn.onclick = async () => {
    const date = document.getElementById("date").value;
    const amount = Number(document.getElementById("amount").value);
    if (!date || !amount) return showToast("Invalid input", 'error');

    try {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Report...';

      const res = await fetch(`${window.API_BASE_URL}/dashboard/daily`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date, amount })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to add daily entry");
      }

      showToast("Success! Daily Progress saved and report sent to WhatsApp.", 'success');
      loadDaily();
    } catch (err) {
      console.error(err);
      showToast("Error: " + err.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Transaction';
    }
  };

  const ctx = document.getElementById("dailyChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: daily.map(d => d.date),
      datasets: [{
        label: "Daily Income (RWF)",
        data: daily.map(d => d.amount),
        borderColor: "#00ffdd",
        backgroundColor: "rgba(0, 255, 221, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
        x: { grid: { display: false }, ticks: { color: '#fff' } }
      },
      plugins: { legend: { labels: { color: '#fff' } } }
    }
  });
}

// ================= MARKETING =================
async function loadMarketing() {
  const res = await fetch(`${window.API_BASE_URL}/dashboard/marketing`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return showToast("Failed to load marketing data", 'error');
  const marketing = await res.json();

  section.innerHTML = `
    <div class="glass-card">
      <h3>Marketing Expenses</h3>
      <div class="input-group">
        <input id="mdate" type="date">
        <input id="cost" type="number" placeholder="Cost (RWF)">
      </div>
      <button id="addMarketingBtn" class="action-btn"><i class="fas fa-bullhorn"></i> Log Expense</button>
      
      <div style="margin-top: 30px;">
        <h4>Expense Logs</h4>
        <ul>
          ${marketing.map(m => `<li><span>${m.date}</span> <span style="color:#00ffdd">${m.cost.toLocaleString()} RWF</span></li>`).join("")}
          ${marketing.length === 0 ? '<li style="opacity:0.5; justify-content:center;">No marketing records</li>' : ''}
        </ul>
      </div>
    </div>
  `;

  document.getElementById("addMarketingBtn").onclick = async () => {
    const date = document.getElementById("mdate").value;
    const cost = Number(document.getElementById("cost").value);
    if (!date || !cost) return showToast("Invalid input", 'error');

    const res = await fetch(`${window.API_BASE_URL}/dashboard/marketing`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date, cost })
    });

    if (!res.ok) {
      const data = await res.json();
      return showToast(data.msg || "Failed to add marketing entry", 'error');
    }

    loadMarketing();
  };
}

// ================= ORDERS / MANAGEMENT =================
async function loadOrders() {
  if (!token) return showToast("Session expired. Please login again.", 'error');

  try {
    const res = await fetch(`${window.API_BASE_URL}/dashboard/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(data.msg || "Failed to load orders", 'error');
    }

    const orders = await res.json();

    section.innerHTML = `
      <div class="glass-card">
        <h3>Order Management</h3>
        <div class="input-group">
          <input id="oDate" type="date">
          <input id="foodType" type="text" placeholder="Food Name (e.g. Big Burger)">
        </div>
        <div class="input-group">
          <input id="oAmount" type="number" placeholder="Amount (RWF)">
          <select id="orderType">
            <option value="">Order Type</option>
            <option value="delivery">Delivery</option>
            <option value="dropup">Dropup</option>
            <option value="pickup">Pickup</option>
            <option value="dine-in">Dine-in</option>
          </select>
        </div>
        <div class="input-group">
          <select id="paymentType">
            <option value="">Select Payment</option>
            <option value="momo">Momo</option>
            <option value="cash">Cash</option>
          </select>
          <button id="addOrderBtn" class="action-btn"><i class="fas fa-paper-plane"></i> Submit Order</button>
        </div>
        
        <div style="margin-top: 30px;">
          <h4>Recent Orders</h4>
          <ul id="orderList">
            ${orders.map(o => `
              <li>
                <div style="display:flex; flex-direction:column; gap:5px; width:100%;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>${o.foodType}</strong> <small style="opacity:0.7">(${o.orderType})</small></span>
                    <span style="color:#00ffdd; font-weight:600;">${Number(o.amount).toLocaleString()} RWF</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.8rem; opacity:0.6;">${o.date}</span>
                    <span class="badge" style="background: rgba(0,255,221,0.2); padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">${o.paymentType.toUpperCase()}</span>
                  </div>
                </div>
              </li>
            `).reverse().join("")}
            ${orders.length === 0 ? '<li style="opacity:0.5; justify-content:center;">No orders registered</li>' : ''}
          </ul>
        </div>
      </div>
    `;

    const submitBtn = document.getElementById("addOrderBtn");
    submitBtn.onclick = async () => {
      const date = document.getElementById("oDate").value;
      const foodType = document.getElementById("foodType").value;
      const amount = Number(document.getElementById("oAmount").value);
      const orderType = document.getElementById("orderType").value;
      const paymentType = document.getElementById("paymentType").value;

      if (!date || !foodType || !amount || !orderType || !paymentType) {
        return showToast("All fields are required", 'error');
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const res = await fetch(`${window.API_BASE_URL}/dashboard/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ date, foodType, amount, paymentType, orderType })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.msg || "Failed to save order");
        }

        showToast("Success! Order saved and WhatsApp notification sent.", 'success');
        loadOrders();
      } catch (err) {
        console.error("Order error:", err);
        showToast("Error: " + err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Order';
      }
    };

  } catch (err) {
    console.error("Failed to load orders:", err);
    showToast("Cannot reach backend.", 'error');
  }
}

// ================= STAFF TRACKING =================
async function loadStaff() {
  section.innerHTML = `<div class="loading">Fetching staff records...</div>`;

  try {
    const res = await fetch(`${window.API_BASE_URL}/dashboard/staff`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Unauthorized access");

    const staffData = await res.json();

    section.innerHTML = `
      <div class="glass-card">
        <h3><i class="fas fa-users"></i> Staff Performance Tracking</h3>
        <p style="opacity:0.7; margin-bottom:25px;">Monitoring activities for all registered users.</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
          ${staffData.map(s => `
            <div class="stat-item" style="background: rgba(255,255,255,0.05); padding:20px; text-align:left; border: 1px solid rgba(0,255,221,0.1);">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="margin:0; color:#00ffdd;">${s.username}</h4>
                <span style="font-size:0.7rem; background:rgba(0,255,221,0.2); padding:2px 8px; border-radius:10px;">${(s.role || 'staff').toUpperCase()}</span>
              </div>
              <p style="font-size:0.8rem; opacity:0.6; margin: 10px 0;">${s.email}</p>
              
              <div style="display:flex; gap:15px; margin-top:15px;">
                <div style="flex:1;">
                  <small style="opacity:0.5; display:block;">Orders Sent</small>
                  <strong style="font-size:1.1rem;">${s.stats.orders}</strong>
                </div>
                <div style="flex:1;">
                  <small style="opacity:0.5; display:block;">Reports Filed</small>
                  <strong style="font-size:1.1rem;">${s.stats.reports}</strong>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    showToast("Error loading staff data", 'error');
    loadHome();
  }
}

// Initialize Dashboard
(async () => {
  const isAuth = await checkAuth();
  if (isAuth) {
    loadUser();
    loadSection("home");
  }
})();
