const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabs = document.querySelectorAll('.tab');
const tradeForm = document.getElementById('tradeForm');
const tradeRows = document.getElementById('tradeRows');

const netPnlEl = document.getElementById('netPnl');
const winRateEl = document.getElementById('winRate');
const totalTradesEl = document.getElementById('totalTrades');
const equityEl = document.getElementById('equity');

let currentUser = null;
let trades = [];

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2200);
}

function fmtCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

function updateStats() {
  const netPnl = trades.reduce((acc, t) => acc + t.pnl, 0);
  const wins = trades.filter((t) => t.pnl > 0).length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : 0;

  netPnlEl.textContent = fmtCurrency(netPnl);
  netPnlEl.className = `num ${netPnl >= 0 ? 'pnl-pos' : 'pnl-neg'}`;

  winRateEl.textContent = `${winRate}%`;
  totalTradesEl.textContent = String(trades.length);
  equityEl.textContent = fmtCurrency((currentUser?.startingBalance || 0) + netPnl);
}

function renderTrades() {
  tradeRows.innerHTML = '';
  for (const t of trades) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.symbol}</td>
      <td>${t.side}</td>
      <td>${t.entry}</td>
      <td>${t.exit}</td>
      <td>${t.size}</td>
      <td class="${t.pnl >= 0 ? 'pnl-pos' : 'pnl-neg'}">${fmtCurrency(t.pnl)}</td>
      <td><button data-id="${t.id}" class="ghost">Delete</button></td>
    `;

    const btn = tr.querySelector('button');
    btn.addEventListener('click', async () => {
      await api(`/api/trades/${t.id}`, { method: 'DELETE' });
      showToast('Trade deleted');
      await loadTrades();
    });

    tradeRows.appendChild(tr);
  }
  updateStats();
}

async function loadTrades() {
  const data = await api('/api/trades');
  trades = data.trades;
  renderTrades();
}

function switchToApp() {
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
}

function switchToAuth() {
  authSection.classList.remove('hidden');
  appSection.classList.add('hidden');
  logoutBtn.classList.add('hidden');
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    if (tab.dataset.tab === 'login') {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    }
  });
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(registerForm);
  try {
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    showToast('Account created. Please login.');
    document.querySelector('[data-tab="login"]').click();
  } catch (err) {
    showToast(err.message);
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(loginForm);
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    currentUser = data.user;
    switchToApp();
    await loadTrades();
    showToast(`Welcome back, ${currentUser.name}`);
  } catch (err) {
    showToast(err.message);
  }
});

tradeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(tradeForm);
  const payload = Object.fromEntries(form.entries());

  try {
    await api('/api/trades', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    tradeForm.reset();
    showToast('Trade saved');
    await loadTrades();
  } catch (err) {
    showToast(err.message);
  }
});

logoutBtn.addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' });
  currentUser = null;
  trades = [];
  switchToAuth();
  showToast('Logged out');
});

(async function init() {
  try {
    const data = await api('/api/me');
    currentUser = data.user;
    switchToApp();
    await loadTrades();
  } catch (_) {
    switchToAuth();
  }
})();
