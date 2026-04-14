/* ═══════════════════════════════════════════════
   ForexGuard — app.js
   ═══════════════════════════════════════════════ */

/* ── State ──────────────────────────────────────── */
let currentUser = null;
let activityChart = null;

/* ── Theme ──────────────────────────────────────── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('fg-theme', theme);
  if (activityChart) updateChartTheme();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function updateChartTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  activityChart.options.scales.x.ticks.color = isDark ? '#94a3b8' : '#64748b';
  activityChart.options.scales.y.ticks.color = isDark ? '#94a3b8' : '#64748b';
  activityChart.options.scales.x.grid.color  = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  activityChart.options.scales.y.grid.color  = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  activityChart.update();
}

/* ── Toast notifications ─────────────────────────── */
function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

/* ── Screen management ──────────────────────────── */
function showScreen(name) {
  const map = { login: 'loginScreen', signup: 'signupScreen', dashboard: 'dashboardScreen' };
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active', 'visible');
  });
  const target = document.getElementById(map[name]);
  target.classList.add('active');
  requestAnimationFrame(() => target.classList.add('visible'));
}

/* ── Auth handlers ──────────────────────────────── */
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const err   = document.getElementById('loginError');

  if (!email || !pass) {
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');

  const namePart = email.split('@')[0].replace(/[._]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  currentUser = { name: namePart, email };
  localStorage.setItem('fg-user', JSON.stringify(currentUser));
  initDashboard();
  showScreen('dashboard');
}

function handleSignup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPassword').value;
  const err   = document.getElementById('signupError');

  if (!name || !email || !pass) {
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');
  currentUser = { name, email };
  localStorage.setItem('fg-user', JSON.stringify(currentUser));
  initDashboard();
  showScreen('dashboard');
  showToast(`Welcome, ${name.split(' ')[0]}!`, 'success');
}

function handleLogout() {
  localStorage.removeItem('fg-user');
  currentUser = null;
  if (activityChart) { activityChart.destroy(); activityChart = null; }
  document.getElementById('loginEmail').value    = '';
  document.getElementById('loginPassword').value = '';
  showScreen('login');
  showToast('Signed out successfully.', 'info');
}

/* ── Dashboard init ─────────────────────────────── */
function initDashboard() {
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('userName').textContent   = currentUser.name;
  document.getElementById('greetName').textContent  = currentUser.name.split(' ')[0];

  const h = new Date().getHours();
  document.getElementById('greeting').textContent =
    h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';

  document.getElementById('dateLabel').textContent =
    new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  buildChart();
}

/* ── Chart.js bar chart ─────────────────────────── */
function buildChart() {
  if (activityChart) { activityChart.destroy(); activityChart = null; }

  const isDark   = document.documentElement.getAttribute('data-theme') === 'dark';
  const data     = [5, 8, 6, 11, 9, 7, 9];
  const days     = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7;
  const gridColor  = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  const labelColor = isDark ? '#94a3b8' : '#64748b';

  const colors = data.map((_, i) =>
    i === todayIdx ? '#3b82f6' : isDark ? 'rgba(59,130,246,.3)' : 'rgba(37,99,235,.25)'
  );

  const ctx = document.getElementById('activityChart').getContext('2d');
  activityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        data,
        backgroundColor: colors,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => ` ${ctx.parsed.y} cases` }
      }},
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { size: 11 } },
          border: { display: false }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { size: 11 }, stepSize: 4 },
          border: { display: false },
          beginAtZero: true
        }
      }
    }
  });
}

/* ── Search ─────────────────────────────────────── */
function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  overlay.classList.add('open');
  document.getElementById('searchInput').focus();
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchInput').value = '';
  filterTable('');
}

function filterTable(query) {
  const rows = document.querySelectorAll('#statementsTable tbody tr');
  const q = query.toLowerCase().trim();
  rows.forEach(row => {
    row.classList.toggle('hidden', q.length > 0 && !row.textContent.toLowerCase().includes(q));
  });
}

/* ── Nav active state ───────────────────────────── */
function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

/* ═══════════════════════════════════════════════
   Event listeners
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Restore theme */
  const savedTheme = localStorage.getItem('fg-theme') || 'dark';
  applyTheme(savedTheme);

  /* Restore session */
  const saved = localStorage.getItem('fg-user');
  if (saved) {
    currentUser = JSON.parse(saved);
    initDashboard();
    showScreen('dashboard');
  } else {
    showScreen('login');
  }

  /* Auth buttons */
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('signupBtn').addEventListener('click', handleSignup);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('goToSignup').addEventListener('click', e => { e.preventDefault(); showScreen('signup'); });
  document.getElementById('goToLogin').addEventListener('click',  e => { e.preventDefault(); showScreen('login'); });

  /* Theme toggle */
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  /* Search */
  document.getElementById('searchBtn').addEventListener('click', openSearch);
  document.getElementById('searchClose').addEventListener('click', closeSearch);
  document.getElementById('searchInput').addEventListener('input', e => filterTable(e.target.value));
  document.getElementById('searchOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('searchOverlay')) closeSearch();
  });

  /* Nav links */
  document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
    link.addEventListener('click', () => setActive(link));
  });

  /* Enter key on auth screens */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSearch(); return; }
    if (e.key !== 'Enter') return;
    if (document.getElementById('loginScreen').classList.contains('active'))  handleLogin();
    if (document.getElementById('signupScreen').classList.contains('active')) handleSignup();
  });

  /* Approve / Deny buttons */
  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-approve')) {
      const item = e.target.closest('.req-item');
      item.style.opacity = '.4';
      item.style.pointerEvents = 'none';
      item.querySelector('.req-detail').textContent = 'Approved — account creation in progress';
      showToast(`${item.querySelector('.req-name').textContent} approved.`, 'success');
    }

    if (e.target.classList.contains('btn-deny')) {
      const item = e.target.closest('.req-item');
      item.style.opacity = '.4';
      item.style.pointerEvents = 'none';
      item.querySelector('.req-detail').textContent = 'Denied';
      showToast(`${item.querySelector('.req-name').textContent} request denied.`, 'error');
    }

    /* Mark email as read */
    if (e.target.closest('.email-item')) {
      const emailItem = e.target.closest('.email-item');
      emailItem.classList.remove('unread');
      const dot = emailItem.querySelector('.email-dot');
      if (dot) dot.classList.add('invisible');
    }
  });
});
