/* ═══════════════════════════════════════════════
   ForexGuard — app.js
   ═══════════════════════════════════════════════ */

/* ── State ──────────────────────────────────────── */
let currentUser     = null;
let currentPage     = 'dashboard';
let activityChart   = null;
let equityChart     = null;
let pairChart       = null;
let selectedEmailId = null;
let tableSort       = { col: null, dir: 'asc' };
let activeAvatarTab = 'color';   // 'color' | 'emoji' | 'photo'

/* ── Utilities ──────────────────────────────────── */
const fmt = n => '$' + Number(n).toLocaleString('en-US');

function statusPill(s) {
  const map = {
    pending:     'amber',
    flagged:     'red',
    'in-review': 'blue',
    approved:    'green',
    rejected:    'red',
    active:      'green',
    suspended:   'red',
  };
  return `<span class="pill ${map[s] || 'blue'}">${s.replace('-', ' ')}</span>`;
}

function kycPill(s) {
  const map = { valid: 'green', expiring: 'amber', expired: 'red' };
  return `<span class="pill ${map[s] || 'blue'}">${s}</span>`;
}

function priorityPill(p) {
  const map = { high: 'red', medium: 'amber', low: 'blue' };
  return `<span class="pill ${map[p] || 'blue'}">${p}</span>`;
}

function ticketStatusPill(s) {
  const map = { open: 'amber', 'in-progress': 'blue', closed: 'green' };
  return `<span class="pill ${map[s] || 'blue'}">${s.replace('-', ' ')}</span>`;
}

function severityIcon(s) {
  const map = { red: 'alert-icon red', amber: 'alert-icon amber', blue: 'alert-icon blue', green: 'alert-icon green' };
  return map[s] || 'alert-icon blue';
}

/* ── Toast ──────────────────────────────────────── */
function showToast(message, type = 'info', undoFn = null) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${icons[type]}</span>
    <span class="toast-msg">${message}</span>
    ${undoFn ? `<button class="toast-undo">Undo</button>` : ''}`;
  container.appendChild(toast);

  let undone = false;
  if (undoFn) {
    toast.querySelector('.toast-undo').addEventListener('click', () => {
      undone = true;
      undoFn();
      toast.remove();
      showToast('Action undone.', 'info');
    });
  }

  const timer = setTimeout(() => toast.remove(), undoFn ? 5000 : 3100);
  toast._timer = timer;
}

/* ── Modal ──────────────────────────────────────── */
function openModal(title, bodyHTML) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

/* ── Theme ──────────────────────────────────────── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('fg-theme', theme);
  if (activityChart) updateChartTheme();
}

function toggleTheme() {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function updateChartTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gc = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  const tc = isDark ? '#94a3b8' : '#64748b';
  [activityChart, equityChart].forEach(ch => {
    if (!ch || !ch.options.scales) return;
    if (ch.options.scales.x) { ch.options.scales.x.ticks.color = tc; ch.options.scales.x.grid.color = gc; }
    if (ch.options.scales.y) { ch.options.scales.y.ticks.color = tc; ch.options.scales.y.grid.color = gc; }
    ch.update();
  });
  if (pairChart) {
    pairChart.options.plugins.legend.labels.color = tc;
    pairChart.update();
  }
}

/* ── Notifications panel ────────────────────────── */
function renderNotifications() {
  /* notifDismissed = hidden from bell panel (alert still active on Risk page) */
  const alerts  = Store.get('alerts').filter(a => a.status === 'active' && !a.notifDismissed).slice(0, 5);
  const emails  = Store.get('emails').filter(e => !e.read).slice(0, 3);
  const total   = alerts.length + emails.length;
  const dot     = document.querySelector('.notif-dot');
  if (dot) dot.style.display = total > 0 ? 'block' : 'none';

  const list = document.getElementById('notifList');
  if (!list) return;
  list.innerHTML = [
    ...alerts.map(a => `
      <div class="notif-item" data-page="risk-alerts" data-notif-type="alert" data-notif-id="${a.id}">
        <div class="notif-item-icon ${a.severity}">${a.icon}</div>
        <div class="notif-item-body">
          <div class="notif-item-title">${a.title}</div>
          <div class="notif-item-sub">${a.account ? a.account + ' · ' : ''}${a.time}</div>
        </div>
      </div>`),
    ...emails.map(e => `
      <div class="notif-item" data-page="support-emails" data-notif-type="email" data-notif-id="${e.id}">
        <div class="notif-item-icon blue">📧</div>
        <div class="notif-item-body">
          <div class="notif-item-title">${e.subject}</div>
          <div class="notif-item-sub">${e.from} · ${e.time}</div>
        </div>
      </div>`)
  ].join('') || '<div class="notif-empty">All caught up ✓</div>';
}

function toggleNotifications() {
  const panel = document.getElementById('notifPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderNotifications();
}

/* ── Screen management ──────────────────────────── */
function showScreen(name) {
  const map = { login: 'loginScreen', signup: 'signupScreen', dashboard: 'dashboardScreen' };
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'visible'));
  const target = document.getElementById(map[name]);
  target.classList.add('active');
  requestAnimationFrame(() => target.classList.add('visible'));
}

/* ── API base URL ───────────────────────────────── */
const API_BASE = 'http://localhost:3001/api';

/* ── Auth ───────────────────────────────────────── */
/* ── Demo / built-in credentials ──────────────────── */
const DEMO_ACCOUNT = { name: 'Demo Agent', email: 'demo@forexguard.com', password: 'Demo@2026' };

/* ══════════════════════════════════════════════════
   SESSION (30-minute expiry)
   ══════════════════════════════════════════════════ */
const SESSION_MS      = 30 * 60 * 1000;        // 30 min
const SESSION_LONG_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function saveSession(user, longSession) {
  const ttl = longSession ? SESSION_LONG_MS : SESSION_MS;
  const key = longSession ? 'fg-session-long' : 'fg-session';
  if (longSession) localStorage.removeItem('fg-session');
  else localStorage.removeItem('fg-session-long');
  localStorage.setItem(key, JSON.stringify({ user, expiry: Date.now() + ttl }));
}

function loadSession() {
  // Try long session first (Remember Me), then regular
  for (const key of ['fg-session-long', 'fg-session']) {
    const s = JSON.parse(localStorage.getItem(key) || 'null');
    if (s && s.expiry > Date.now()) return s.user;
    if (s) localStorage.removeItem(key);
  }
  return null;
}

function extendSession() {
  if (!currentUser) return;
  const isLong = !!localStorage.getItem('fg-session-long');
  saveSession(currentUser, isLong);
}

/* ══════════════════════════════════════════════════
   PROFILE STORE  (avatar, stats — per email)
   ══════════════════════════════════════════════════ */
function getProfile(email) {
  return JSON.parse(localStorage.getItem('fg-profile-' + email) || '{}');
}

function saveProfileData(email, data) {
  localStorage.setItem('fg-profile-' + email, JSON.stringify({ ...getProfile(email), ...data }));
}

/* ══════════════════════════════════════════════════
   AVATAR  SYSTEM
   ══════════════════════════════════════════════════ */
const AVATAR_COLORS = [
  { id: 'indigo',  bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', hex: '#6366f1' },
  { id: 'blue',    bg: 'linear-gradient(135deg,#3b82f6,#2563eb)', hex: '#3b82f6' },
  { id: 'violet',  bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', hex: '#8b5cf6' },
  { id: 'emerald', bg: 'linear-gradient(135deg,#10b981,#059669)', hex: '#10b981' },
  { id: 'rose',    bg: 'linear-gradient(135deg,#f43f5e,#e11d48)', hex: '#f43f5e' },
  { id: 'amber',   bg: 'linear-gradient(135deg,#f59e0b,#d97706)', hex: '#f59e0b' },
  { id: 'cyan',    bg: 'linear-gradient(135deg,#06b6d4,#0891b2)', hex: '#06b6d4' },
  { id: 'pink',    bg: 'linear-gradient(135deg,#ec4899,#db2777)', hex: '#ec4899' },
];
const AVATAR_EMOJIS = ['🦁','🐯','🦊','🐺','🦅','🐉','🦄','🌊','⚡','🔥','🎯','🛡️'];

function nameToColorId(name = '') {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length].id;
}

function getAvatarBg(user) {
  if (user.avatarType === 'emoji' || user.avatarType === 'photo') return 'var(--surface2)';
  const id = user.avatarValue || nameToColorId(user.name);
  const preset = AVATAR_COLORS.find(c => c.id === id);
  if (preset) return preset.bg;
  return id; // raw CSS colour (custom hex from colour picker)
}

/* ── Image compression (canvas → 160×160 JPEG ~20 KB) ── */
function compressImage(file, cb) {
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const SIZE = 160;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      const min = Math.min(img.width, img.height);
      const sx  = (img.width  - min) / 2;
      const sy  = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
      cb(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function applyUserColor(user) {
  /* Only colours the avatar circle — nav is handled by applyAccentColor() */
  const id  = (user.avatarType !== 'emoji' && user.avatarValue) ? user.avatarValue : nameToColorId(user.name);
  const hex = AVATAR_COLORS.find(c => c.id === id)?.hex || '#6366f1';
  document.documentElement.style.setProperty('--user-color', hex);
}

function applyAccentColor(colorId) {
  const hex = AVATAR_COLORS.find(c => c.id === colorId)?.hex || '#3b82f6';
  let s = document.getElementById('accent-color-style');
  if (!s) { s = document.createElement('style'); s.id = 'accent-color-style'; document.head.appendChild(s); }
  s.textContent = [
    `.nav-link.active{color:${hex}!important;background:${hex}22!important}`,
    `.nav-link.active .icon{color:${hex}!important}`,
    `.nav-link .badge{background:${hex}18!important;color:${hex}!important;border-color:${hex}44!important}`,
    `.filter-tab.active{border-color:${hex}!important;color:${hex}!important}`,
  ].join('');
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPassword').value;
  const err   = document.getElementById('loginError');
  const btn   = document.getElementById('loginBtn');

  if (!email || !pass) {
    err.textContent = 'Please enter your email and password.';
    err.classList.add('show'); return;
  }

  /* ── Demo account — no API call needed ── */
  let matchedUser = null;
  if (email === DEMO_ACCOUNT.email && pass === DEMO_ACCOUNT.password) {
    matchedUser = { name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email, role: 'risk' };
  }

  /* ── Real account — call the API ── */
  if (!matchedUser) {
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const json = await res.json();
      if (!res.ok) {
        err.textContent = json.error || 'Login failed. Please try again.';
        err.classList.add('show');
        btn.disabled = false; btn.textContent = 'Sign In';
        return;
      }
      matchedUser = { name: json.name, email, role: json.role };
    } catch {
      err.textContent = 'Cannot reach server. Check your connection.';
      err.classList.add('show');
      btn.disabled = false; btn.textContent = 'Sign In';
      return;
    }
    btn.disabled = false; btn.textContent = 'Sign In';
  }

  err.classList.remove('show');

  /* Merge with saved profile data (avatar, stats) */
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const profile = getProfile(matchedUser.email);
  profile.loginCount = (profile.loginCount || 0) + 1;
  profile.lastActive = now;
  if (!profile.joinedDate) profile.joinedDate = now;
  saveProfileData(matchedUser.email, profile);

  currentUser = { ...matchedUser, ...profile };
  const history = JSON.parse(localStorage.getItem(`fg-login-history-${email}`) || '[]');
  history.unshift({ time: new Date().toLocaleString('en-US', { dateStyle:'medium', timeStyle:'short' }), device: navigator.platform || 'Unknown' });
  if (history.length > 10) history.pop();
  localStorage.setItem(`fg-login-history-${email}`, JSON.stringify(history));
  const rememberMe = document.getElementById('rememberMe')?.checked;
  saveSession(currentUser, rememberMe);
  Store.addAudit('Login', currentUser.name, rememberMe ? 'Signed in (Remember Me — 30 days)' : 'Signed in via email/password');
  initDashboard();
  showScreen('dashboard');
  navigate('dashboard');
}

/* ── Password strength meter ────────────────────── */
function updatePasswordStrength(val) {
  const wrap  = document.getElementById('pwStrengthWrap');
  const fill  = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!wrap) return;

  const rules = {
    len:   val.length >= 8,
    upper: /[A-Z]/.test(val),
    num:   /[0-9]/.test(val),
    sym:   /[^A-Za-z0-9]/.test(val),
  };

  // Update rule indicators
  Object.entries(rules).forEach(([key, pass]) => {
    const el = document.getElementById(`rule-${key}`);
    if (el) el.classList.toggle('pass', pass);
  });

  const score = Object.values(rules).filter(Boolean).length;
  const levels = ['', 'weak', 'fair', 'good', 'strong'];
  const colours = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  wrap.style.display = val.length ? 'flex' : 'none';
  fill.style.width   = `${score * 25}%`;
  fill.style.background = colours[score] || '#ef4444';
  label.textContent  = val.length ? (levels[score] || 'weak').toUpperCase() : '';
  label.style.color  = colours[score] || '#ef4444';
}

async function handleSignup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('signupPassword').value;
  const role  = document.getElementById('signupRole')?.value;
  const err   = document.getElementById('signupError');
  const btn   = document.getElementById('signupBtn');

  if (!name || !email || !pass || !role) {
    err.textContent = 'Please fill in all fields.';
    err.classList.add('show'); return;
  }
  if (pass.length < 6) {
    err.textContent = 'Password must be at least 6 characters.';
    err.classList.add('show'); return;
  }

  btn.disabled = true;
  btn.textContent = 'Creating account…';

  try {
    const res  = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, role }),
    });
    const json = await res.json();
    if (!res.ok) {
      err.textContent = json.error || 'Registration failed. Please try again.';
      err.classList.add('show');
      btn.disabled = false; btn.textContent = 'Create Account';
      return;
    }
  } catch {
    err.textContent = 'Cannot reach server. Check your connection.';
    err.classList.add('show');
    btn.disabled = false; btn.textContent = 'Create Account';
    return;
  }

  btn.disabled = false; btn.textContent = 'Create Account';
  err.classList.remove('show');

  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  saveProfileData(email, { joinedDate: now, loginCount: 1, lastActive: now });
  currentUser = { name, email, role, joinedDate: now, loginCount: 1, lastActive: now };
  saveSession(currentUser);
  Store.addAudit('Signup', name, 'Created new agent account via API');
  initDashboard();
  showScreen('dashboard');
  navigate('dashboard');
  showToast(`Welcome, ${name.split(' ')[0]}!`, 'success');
}

function handleLogout() {
  Store.addAudit('Logout', currentUser?.name || 'Agent', 'Signed out');
  localStorage.removeItem('fg-session');
  localStorage.removeItem('fg-session-long');
  currentUser = null;
  if (activityChart) { activityChart.destroy(); activityChart = null; }
  if (equityChart)   { equityChart.destroy();   equityChart   = null; }
  if (pairChart)     { pairChart.destroy();     pairChart     = null; }
  document.getElementById('loginEmail').value    = '';
  document.getElementById('loginPassword').value = '';
  showScreen('login');
  showToast('Signed out successfully.', 'info');
}

/* ── Sidebar badge counts ────────────────────────── */
function updateSidebarBadges() {
  const counts = {
    'statements':      { n: Store.get('statements').filter(s => s.status === 'pending').length,      cls: 'amber' },
    'repeat-accounts': { n: Store.get('repeatAccounts').filter(r => r.status === 'pending').length,  cls: '' },
    'kyc-reviews':     { n: Store.get('kyc').filter(k => k.status !== 'valid').length,              cls: 'amber' },
    'risk-alerts':     { n: Store.get('alerts').filter(a => a.status === 'active').length,           cls: '' },
    'support-emails':  { n: Store.get('emails').filter(e => !e.read).length,                        cls: '' },
    'tickets':         { n: Store.get('tickets').filter(t => t.status !== 'closed').length,         cls: 'green' },
  };
  Object.entries(counts).forEach(([page, { n, cls }]) => {
    const link = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (!link) return;
    let badge = link.querySelector('.badge');
    if (n > 0) {
      if (!badge) { badge = document.createElement('span'); link.appendChild(badge); }
      badge.className = 'badge' + (cls ? ' ' + cls : '');
      badge.textContent = n;
    } else if (badge) { badge.remove(); }
  });
}

/* ── Mobile bottom nav ──────────────────────────── */
function updateMobileBottomNav(page) {
  document.querySelectorAll('.mbn-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  // Dot indicators
  const dotMap = {
    'mbn-dot-statements': Store.get('statements').filter(s => s.status === 'pending').length > 0,
    'mbn-dot-alerts':     Store.get('alerts').filter(a => a.status === 'active').length > 0,
    'mbn-dot-emails':     Store.get('emails').filter(e => !e.read).length > 0,
  };
  Object.entries(dotMap).forEach(([id, show]) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('visible', show);
  });
}

/* ── Dashboard init ─────────────────────────────── */
function initDashboard() {
  const u = currentUser;
  const initials = (u.avatarCustomInitials || u.name.split(' ').map(w => w[0]).join('')).slice(0, 2).toUpperCase();
  const av = document.getElementById('userAvatar');
  if (u.avatarType === 'photo' && u.avatarValue) {
    av.textContent = '';
    av.style.background = `url(${u.avatarValue}) center/cover no-repeat`;
    av.style.fontSize = '';
    av.style.border = '2px solid var(--border)';
  } else if (u.avatarType === 'emoji' && u.avatarValue) {
    av.textContent = u.avatarValue;
    av.style.background = 'var(--surface2)';
    av.style.fontSize = '20px';
    av.style.border = '2px solid var(--border)';
  } else {
    av.textContent = initials;
    av.style.background = getAvatarBg(u);
    av.style.fontSize = '';
    av.style.border = '';
  }
  document.getElementById('userName').textContent = u.name;
  applyUserColor(u);
  applyAccentColor(Store.get('preferences')?.accentColor || 'blue');
  renderNotifications();
  updateSidebarBadges();
  updateMobileBottomNav(currentPage);
}

/* ════════════════════════════════════════════════
   SKELETON LOADER
   ════════════════════════════════════════════════ */
function skeletonLoader(page) {
  const bar  = (w='100%', h='14px', r='6px') =>
    `<div class="sk-bar" style="width:${w};height:${h};border-radius:${r}"></div>`;
  const card = (rows=3) =>
    `<div class="sk-card">${bar('55%','11px')}<div style="margin-top:14px;display:flex;flex-direction:column;gap:10px;">${Array(rows).fill(bar()).join('')}</div></div>`;

  if (page === 'dashboard') return `
    <div class="sk-wrap">
      <div class="sk-header">${bar('220px','28px','8px')}${bar('340px','14px')}</div>
      <div class="sk-stats">${Array(4).fill(`<div class="sk-stat-card">${bar('60%','10px')}${bar('40%','28px','6px')}</div>`).join('')}</div>
      <div class="sk-two-col">${card(4)} ${card(5)}</div>
      <div class="sk-two-col" style="margin-top:20px">${card(3)} ${card(4)}</div>
    </div>`;

  if (page === 'statements' || page === 'kyc-reviews' || page === 'risk-alerts') return `
    <div class="sk-wrap">
      <div class="sk-header">${bar('200px','28px','8px')}${bar('300px','14px')}</div>
      <div class="sk-tabs">${Array(5).fill(bar('80px','32px','20px')).join('')}</div>
      <div class="sk-card">
        ${bar('100%','12px')}
        ${Array(6).fill(`<div class="sk-row">${bar('28%','12px')} ${bar('15%','12px')} ${bar('18%','12px')} ${bar('12%','22px','12px')}</div>`).join('')}
      </div>
    </div>`;

  // Generic skeleton for all other pages
  return `
    <div class="sk-wrap">
      <div class="sk-header">${bar('200px','28px','8px')}${bar('300px','14px')}</div>
      <div class="sk-stats">${Array(4).fill(`<div class="sk-stat-card">${bar('55%','10px')}${bar('45%','26px','6px')}</div>`).join('')}</div>
      <div class="sk-two-col">${card(4)} ${card(5)}</div>
    </div>`;
}

/* ════════════════════════════════════════════════
   ROUTER
   ════════════════════════════════════════════════ */
const PAGE_MAP = {
  dashboard:        { label: 'Overview',            render: renderDashboard },
  statements:       { label: 'Account Statements',  render: renderStatements },
  'repeat-accounts':{ label: 'Repeat Accounts',     render: renderRepeatAccounts },
  'client-profiles':{ label: 'Client Profiles',     render: renderClientProfiles },
  'kyc-reviews':    { label: 'KYC Reviews',         render: renderKycReviews },
  'forex-accounts': { label: 'Forex Accounts',      render: renderForexAccounts },
  'risk-alerts':    { label: 'Risk Alerts',         render: renderRiskAlerts },
  'exposure-reports':{ label: 'Exposure Reports',   render: renderExposureReports },
  'audit-logs':     { label: 'Audit Logs',          render: renderAuditLogs },
  'support-emails': { label: 'Support Emails',      render: renderSupportEmails },
  tickets:          { label: 'Tickets',             render: renderTickets },
  preferences:      { label: 'Preferences',         render: renderPreferences },
  profile:          { label: 'My Profile',          render: renderProfile },
};

function navigate(page) {
  currentPage = page;
  extendSession();
  /* Reset avatar tab to match current avatar type when entering profile */
  if (page === 'profile') {
    const t = currentUser?.avatarType;
    activeAvatarTab = t === 'photo' ? 'photo' : t === 'emoji' ? 'emoji' : 'color';
  }
  document.getElementById('notifPanel').classList.remove('open');

  // Update topbar title
  document.getElementById('topbarTitle').textContent = PAGE_MAP[page]?.label || 'Overview';

  // Update active nav
  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  updateMobileBottomNav(page);

  // Render page with fade transition
  const mc = document.getElementById('mainContent');
  mc.classList.add('page-exit');
  setTimeout(() => {
    mc.classList.remove('page-exit');
    mc.innerHTML = skeletonLoader(page);
    requestAnimationFrame(() => {
      mc.innerHTML = (PAGE_MAP[page]?.render || renderDashboard)();
      mc.classList.add('page-enter');
      requestAnimationFrame(() => {
        mc.classList.remove('page-enter');
        afterRender(page);
      });
    });
  }, 120);
}

function afterRender(page) {
  selectedEmailId = null;
  if (page === 'dashboard')        { initDashboardChart(); initEquityChart(); initPairChart(); initSparklines(); }
  if (page === 'exposure-reports') initExposureCharts();
  if (page === 'statements')       initSortableTable('statementsTable', () => {
    const f = document.getElementById('statementsTable')?.dataset.filter || 'all';
    const all = Store.get('statements');
    return f === 'all' ? all : all.filter(s => s.status === f);
  }, stmtRows, 'stmtCount');
  if (page === 'profile') {
    const t = currentUser?.avatarType;
    activeAvatarTab = t === 'photo' ? 'photo' : t === 'emoji' ? 'emoji' : 'color';
  }
  if (page === 'forex-accounts') loadForexAccounts();
}

/* ════════════════════════════════════════════════
   PAGE: DASHBOARD
   ════════════════════════════════════════════════ */
function renderDashboard() {
  const stmts    = Store.get('statements');
  const pending  = stmts.filter(s => s.status === 'pending').length;
  const repeat   = Store.get('repeatAccounts').filter(r => r.status === 'pending').length;
  const emails   = Store.get('emails').filter(e => !e.read).length;
  const today    = Store.get('audit').filter(a => a.action.includes('Approved') || a.action.includes('Resolved')).length;
  const alerts   = Store.get('alerts').filter(a => a.status === 'active');
  const requests = Store.get('repeatAccounts').filter(r => r.status === 'pending').slice(0, 4);
  const inbox    = Store.get('emails').slice(0, 5);
  const topStmts = stmts.slice(0, 5);

  return `
  <div class="page-header">
    <h1>Good <span id="greeting"></span>, <span id="greetName">${currentUser?.name?.split(' ')[0] || ''}</span> 👋</h1>
    <p>Here's what's on your plate today — ${pending + repeat} items need your attention.</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card accent-amber" data-nav-card="statements">
      <div class="stat-top">
        <div class="stat-icon">📋</div>
        <canvas class="stat-spark" id="spark0" width="80" height="32"></canvas>
      </div>
      <div class="stat-label">Pending Statements</div>
      <div class="stat-value">${pending}</div>
      <div class="stat-sub"><span class="up">↑ ${Math.max(0,pending-3)}</span> since yesterday</div>
    </div>
    <div class="stat-card accent-red" data-nav-card="repeat-accounts">
      <div class="stat-top">
        <div class="stat-icon">🔄</div>
        <canvas class="stat-spark" id="spark1" width="80" height="32"></canvas>
      </div>
      <div class="stat-label">Repeat Account Requests</div>
      <div class="stat-value">${repeat}</div>
      <div class="stat-sub"><span class="down">${Math.min(repeat,2)} urgent</span> · awaiting approval</div>
    </div>
    <div class="stat-card accent-blue" data-nav-card="support-emails">
      <div class="stat-top">
        <div class="stat-icon">📧</div>
        <canvas class="stat-spark" id="spark2" width="80" height="32"></canvas>
      </div>
      <div class="stat-label">Unread Support Emails</div>
      <div class="stat-value">${emails}</div>
      <div class="stat-sub"><span class="up">Oldest:</span> 2 days ago</div>
    </div>
    <div class="stat-card accent-green">
      <div class="stat-top">
        <div class="stat-icon">✅</div>
        <canvas class="stat-spark" id="spark3" width="80" height="32"></canvas>
      </div>
      <div class="stat-label">Resolved Today</div>
      <div class="stat-value">${today || 9}</div>
      <div class="stat-sub"><span class="up">↑ 2</span> above daily avg</div>
    </div>
  </div>

  <div class="widgets-grid">
    <div class="widget">
      <div class="widget-header">
        <h3>📋 Account Statements — Pending Review</h3>
        <div class="wh-right">
          <span class="pill amber">${pending} pending</span>
          <button class="btn-sm" data-nav-btn="statements">View All</button>
        </div>
      </div>
      <table class="data-table" id="statementsTable">
        <thead><tr><th>Client</th><th>Account ID</th><th>Balance</th><th>Status</th><th>Submitted</th></tr></thead>
        <tbody>
          ${topStmts.map(s => `
          <tr class="clickable-row" data-action="stmt-detail" data-id="${s.id}">
            <td><div class="client-cell"><div class="mini-avatar ${s.color}">${s.initials}</div>${s.client}</div></td>
            <td>#${s.id}</td><td>${fmt(s.balance)}</td>
            <td>${statusPill(s.status)}</td><td>${s.submitted}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="widget">
      <div class="widget-header"><h3>⚠️ Risk Alerts</h3><span class="pill red">${alerts.length} active</span></div>
      <div class="alert-list">
        ${alerts.slice(0,5).map(a => `
        <div class="alert-item" data-action="alert-detail" data-id="${a.id}">
          <div class="${severityIcon(a.severity)}">${a.icon}</div>
          <div class="alert-body"><div class="alert-title">${a.title}</div><div class="alert-desc">${a.desc}</div></div>
          <div class="alert-time">${a.time}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="charts-row">
    <div class="widget">
      <div class="widget-header">
        <h3>📈 Portfolio Equity Curve</h3>
        <div class="range-tabs">
          <button class="range-tab active" data-range="7">7D</button>
          <button class="range-tab" data-range="30">30D</button>
          <button class="range-tab" data-range="90">90D</button>
        </div>
      </div>
      <div class="chart-area-lg"><canvas id="equityChart"></canvas></div>
    </div>
    <div class="widget">
      <div class="widget-header">
        <h3>🌍 Exposure by Pair</h3>
        <span class="pill blue">Live</span>
      </div>
      <div class="chart-area-lg chart-center"><canvas id="pairChart"></canvas></div>
    </div>
  </div>

  <div class="bottom-grid">
    <div class="widget">
      <div class="widget-header"><h3>🔄 Repeat Account Requests</h3><span class="pill red">${repeat} pending</span></div>
      <div class="req-list">
        ${requests.map(r => `
        <div class="req-item" data-id="${r.id}">
          <div class="req-info">
            <div class="req-name">${r.client}</div>
            <div class="req-detail">Prev: #${r.prevAccount} · Closed ${r.closedDate} · ${r.reason}</div>
          </div>
          <div class="req-actions">
            <button class="btn-approve" data-action="approve-repeat" data-id="${r.id}">Approve</button>
            <button class="btn-deny"    data-action="deny-repeat"    data-id="${r.id}">Deny</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="widget">
      <div class="widget-header">
        <h3>📧 Support Emails</h3>
        <div class="wh-right"><span class="pill blue">${emails} unread</span><button class="btn-sm" data-nav-btn="support-emails">Open Inbox</button></div>
      </div>
      <div class="email-list">
        ${inbox.map(e => `
        <div class="email-item ${e.read ? '' : 'unread'}" data-action="read-email" data-id="${e.id}">
          <div class="email-dot ${e.read ? 'invisible' : ''}"></div>
          <div class="email-info">
            <div class="email-from">${e.from}${e.accountId ? ' · #' + e.accountId : ''}</div>
            <div class="email-subject">${e.subject}</div>
          </div>
          <div class="email-time">${e.time}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="widget">
      <div class="widget-header"><h3>⚡ Quick Actions</h3></div>
      <div class="qa-grid">
        <div class="qa-btn" data-nav-btn="statements"><div class="qa-icon">📋</div><div class="qa-label">Review Statement</div><div class="qa-sub">${pending} awaiting</div></div>
        <div class="qa-btn" data-nav-btn="repeat-accounts"><div class="qa-icon">🔄</div><div class="qa-label">Repeat Accounts</div><div class="qa-sub">${repeat} pending</div></div>
        <div class="qa-btn" data-nav-btn="support-emails"><div class="qa-icon">✉️</div><div class="qa-label">Support Inbox</div><div class="qa-sub">${emails} unread</div></div>
        <div class="qa-btn" data-nav-btn="exposure-reports"><div class="qa-icon">📊</div><div class="qa-label">Risk Report</div><div class="qa-sub">View exposure</div></div>
      </div>
      <div class="chart-area">
        <div class="chart-label">Cases resolved — last 7 days</div>
        <canvas id="activityChart"></canvas>
      </div>
    </div>
  </div>`;
}

function initDashboardChart() {
  if (activityChart) { activityChart.destroy(); activityChart = null; }
  const canvas = document.getElementById('activityChart');
  if (!canvas) return;
  const isDark   = document.documentElement.getAttribute('data-theme') === 'dark';
  const data     = [5, 8, 6, 11, 9, 7, 9];
  const days     = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7;
  const gc = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  const tc = isDark ? '#94a3b8' : '#64748b';
  activityChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: { labels: days, datasets: [{ data, backgroundColor: data.map((_, i) => i === todayIdx ? '#3b82f6' : isDark ? 'rgba(59,130,246,.3)' : 'rgba(37,99,235,.25)'), borderRadius: 4, borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} cases` } } }, scales: { x: { grid: { color: gc }, ticks: { color: tc, font: { size: 11 } }, border: { display: false } }, y: { grid: { color: gc }, ticks: { color: tc, font: { size: 11 }, stepSize: 4 }, border: { display: false }, beginAtZero: true } } }
  });
  // Re-set greeting after render
  const h = new Date().getHours();
  const gEl = document.getElementById('greeting');
  if (gEl) gEl.textContent = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

function drawSparkline(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '55');
  grad.addColorStop(1, color + '00');

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  // Fill to bottom
  ctx.lineTo((data.length - 1) * step, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function initSparklines() {
  drawSparkline('spark0', [11,14,9,16,12,15,14], '#f59e0b');
  drawSparkline('spark1', [5,7,4,8,6,8,7],       '#ef4444');
  drawSparkline('spark2', [8,12,10,14,9,11,10],   '#3b82f6');
  drawSparkline('spark3', [6,7,9,8,10,9,9],       '#22c55e');
}

/* Full 90-day equity dataset — sliced by range selection */
const EQUITY_90 = [
  7.60,7.63,7.58,7.66,7.70,7.67,7.74,7.71,7.79,7.76,
  7.83,7.80,7.88,7.85,7.92,7.89,7.95,7.91,7.98,7.95,
  8.02,7.99,8.06,8.03,8.10,8.14,8.09,8.18,8.22,8.19,
  8.25,8.21,8.30,8.27,8.35,8.31,8.40,8.38,8.44,8.41,
  8.50,8.46,8.53,8.49,8.57,8.54,8.61,8.58,8.65,8.63,
  8.70,8.68,8.74,8.71,8.78,8.75,8.81,8.79,8.85,8.82,
  8.88,8.85,8.91,8.88,8.94,8.92,8.97,8.95,9.00,8.97,
  9.02,9.00,9.05,9.02,9.07,9.04,9.09,9.06,9.10,8.40,
  8.45,8.42,8.48,8.45,8.51,8.49,8.54,8.51,8.57,8.40
];

function initEquityChart(days = 30) {
  if (equityChart) { equityChart.destroy(); equityChart = null; }
  const canvas = document.getElementById('equityChart');
  if (!canvas) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gc = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  const tc = isDark ? '#94a3b8' : '#64748b';

  const slice = EQUITY_90.slice(-days);
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  equityChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Portfolio Value ($B)',
        data: slice,
        borderColor: '#22c55e',
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          g.addColorStop(0, 'rgba(34,197,94,.25)');
          g.addColorStop(1, 'rgba(34,197,94,0)');
          return g;
        },
        fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.y.toFixed(2)}B` } }
      },
      scales: {
        x: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 }, maxTicksLimit: days <= 7 ? 7 : 8 }, border: { display: false } },
        y: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 }, callback: v => `$${v}B` }, border: { display: false }, beginAtZero: false }
      }
    }
  });

  // Wire up range tab clicks
  document.querySelectorAll('.range-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      initEquityChart(Number(btn.dataset.range));
    });
  });
}

function initPairChart() {
  if (pairChart) { pairChart.destroy(); pairChart = null; }
  const canvas = document.getElementById('pairChart');
  if (!canvas) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const tc = isDark ? '#94a3b8' : '#64748b';
  pairChart = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'Other'],
      datasets: [{
        data: [32, 24, 18, 12, 8, 6],
        backgroundColor: ['#3b82f6','#6366f1','#22c55e','#f59e0b','#ef4444','#64748b'],
        borderWidth: 0, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: tc, font: { size: 11 }, padding: 12, boxWidth: 10, boxHeight: 10 } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } }
      },
      cutout: '62%'
    }
  });
}

/* ════════════════════════════════════════════════
   CSV EXPORT
   ════════════════════════════════════════════════ */
function exportCSV(filename, headers, rows) {
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(','),
    ...rows.map(r => r.map(esc).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`, 'success');
}

function exportStatements() {
  const data = Store.get('statements');
  exportCSV('account-statements.csv',
    ['Account ID', 'Client', 'Balance', 'Status', 'Submitted'],
    data.map(s => [s.id, s.client, s.balance, s.status, s.submitted])
  );
}

function exportKyc() {
  const data = Store.get('kyc');
  exportCSV('kyc-reviews.csv',
    ['Account ID', 'Client', 'Document Type', 'Expiry', 'Days Left', 'Status'],
    data.map(k => [k.accountId, k.client, k.docType, k.expiry, k.daysLeft, k.status])
  );
}

/* ════════════════════════════════════════════════
   TABLE SORT / SEARCH HELPERS
   ════════════════════════════════════════════════ */
function stmtRows(data) {
  return data.map(s => `
  <tr class="clickable-row" data-action="stmt-detail" data-id="${s.id}">
    <td class="bulk-check-cell" onclick="event.stopPropagation()">
      <label class="bulk-checkbox"><input type="checkbox" class="bulk-row-check" value="${s.id}" onchange="onBulkCheckChange()"><span class="bulk-box"></span></label>
    </td>
    <td><div class="client-cell"><div class="mini-avatar ${s.color}">${s.initials}</div>${s.client}</div></td>
    <td>#${s.id}</td><td>${fmt(s.balance)}</td>
    <td>${statusPill(s.status)}</td><td>${s.submitted}</td>
    <td>
      ${s.status !== 'approved' && s.status !== 'rejected' ? `
      <div class="row-actions">
        <button class="btn-approve" data-action="approve-stmt" data-id="${s.id}">Approve</button>
        <button class="btn-deny"    data-action="reject-stmt"  data-id="${s.id}">Reject</button>
      </div>` : '<span class="muted-text">—</span>'}
    </td>
  </tr>`).join('');
}

function onBulkCheckChange() {
  const checks = [...document.querySelectorAll('.bulk-row-check')];
  const selected = checks.filter(c => c.checked).map(c => c.value);
  const bar = document.getElementById('bulkBar');
  if (!bar) return;
  if (selected.length > 0) {
    bar.classList.add('visible');
    document.getElementById('bulkCount').textContent = `${selected.length} selected`;
  } else {
    bar.classList.remove('visible');
  }
  // Sync select-all checkbox
  const allCheck = document.getElementById('bulkSelectAll');
  if (allCheck) allCheck.indeterminate = selected.length > 0 && selected.length < checks.length;
  if (allCheck) allCheck.checked = selected.length === checks.length && checks.length > 0;
}

function bulkSelectAll(checked) {
  document.querySelectorAll('.bulk-row-check').forEach(c => c.checked = checked);
  onBulkCheckChange();
}

function bulkApprove() {
  const ids = [...document.querySelectorAll('.bulk-row-check:checked')].map(c => c.value);
  ids.forEach(id => { Store.update('statements', id, { status: 'approved' }); Store.addAudit('Approved Statement', `#${id}`, 'Bulk approved'); });
  document.getElementById('mainContent').innerHTML = renderStatements();
  renderNotifications(); updateSidebarBadges();
  showToast(`${ids.length} statement${ids.length > 1 ? 's' : ''} approved.`, 'success');
}

function bulkReject() {
  const ids = [...document.querySelectorAll('.bulk-row-check:checked')].map(c => c.value);
  ids.forEach(id => { Store.update('statements', id, { status: 'rejected' }); Store.addAudit('Rejected Statement', `#${id}`, 'Bulk rejected'); });
  document.getElementById('mainContent').innerHTML = renderStatements();
  renderNotifications(); updateSidebarBadges();
  showToast(`${ids.length} statement${ids.length > 1 ? 's' : ''} rejected.`, 'error');
}

function bulkExportSelected() {
  const ids = new Set([...document.querySelectorAll('.bulk-row-check:checked')].map(c => c.value));
  const data = Store.get('statements').filter(s => ids.has(String(s.id)));
  exportCSV('selected-statements.csv',
    ['Account ID','Client','Balance','Status','Submitted'],
    data.map(s => [s.id, s.client, s.balance, s.status, s.submitted])
  );
}

function filterStmtTable(q) {
  const tbody = document.getElementById('stmtTbody');
  const countEl = document.getElementById('stmtCount');
  if (!tbody) return;
  const filter = document.getElementById('statementsTable')?.dataset.filter || 'all';
  let data = Store.get('statements');
  if (filter !== 'all') data = data.filter(s => s.status === filter);
  if (q) data = data.filter(s => s.client.toLowerCase().includes(q.toLowerCase()) || String(s.id).includes(q));
  if (tableSort.col) data = sortData(data, tableSort.col, tableSort.dir);
  tbody.innerHTML = stmtRows(data);
  if (countEl) countEl.textContent = `${data.length} record${data.length !== 1 ? 's' : ''}`;
}

function sortData(data, col, dir) {
  return [...data].sort((a, b) => {
    let av = a[col], bv = b[col];
    if (col === 'balance') { av = Number(av); bv = Number(bv); }
    else if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    return (dir === 'asc' ? 1 : -1) * (av > bv ? 1 : av < bv ? -1 : 0);
  });
}

function initSortableTable(tableId, getDataFn, renderRowsFn, countElId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  tableSort = { col: null, dir: 'asc' };
  table.querySelectorAll('th.sortable').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (tableSort.col === col) tableSort.dir = tableSort.dir === 'asc' ? 'desc' : 'asc';
      else { tableSort.col = col; tableSort.dir = 'asc'; }
      table.querySelectorAll('th.sortable').forEach(t => {
        t.classList.remove('sort-asc','sort-desc');
        t.querySelector('.sort-icon').textContent = '⇅';
      });
      th.classList.add(`sort-${tableSort.dir}`);
      th.querySelector('.sort-icon').textContent = tableSort.dir === 'asc' ? '↑' : '↓';
      const searchQ = document.getElementById('stmtSearch')?.value || '';
      const tbody = table.querySelector('tbody');
      let data = getDataFn();
      if (searchQ) data = data.filter(s => s.client?.toLowerCase().includes(searchQ.toLowerCase()) || String(s.id).includes(searchQ));
      data = sortData(data, tableSort.col, tableSort.dir);
      tbody.innerHTML = renderRowsFn(data);
      if (countElId) {
        const el = document.getElementById(countElId);
        if (el) el.textContent = `${data.length} record${data.length !== 1 ? 's' : ''}`;
      }
    });
  });
}

/* ════════════════════════════════════════════════
   PAGE: ACCOUNT STATEMENTS
   ════════════════════════════════════════════════ */
function renderStatements(filter = 'all') {
  const all    = Store.get('statements');
  const counts = { all: all.length, pending: 0, flagged: 0, 'in-review': 0, approved: 0, rejected: 0 };
  all.forEach(s => { if (counts[s.status] !== undefined) counts[s.status]++; });
  const shown  = filter === 'all' ? all : all.filter(s => s.status === filter);

  return `
  <div class="page-header">
    <h1>Account Statements</h1>
    <p>Review, approve, or flag pending client account submissions.</p>
  </div>
  <div class="filter-tabs">
    ${['all','pending','flagged','in-review','approved','rejected'].map(f => `
    <button class="filter-tab ${filter === f ? 'active' : ''}" data-action="filter-statements" data-filter="${f}">
      ${f === 'all' ? 'All' : f.replace('-',' ')} <span class="tab-count">${counts[f] || 0}</span>
    </button>`).join('')}
  </div>
  <div class="widget">
    <div class="bulk-bar" id="bulkBar">
      <span id="bulkCount">0 selected</span>
      <button class="bulk-action-btn green"  onclick="bulkApprove()">✓ Approve All</button>
      <button class="bulk-action-btn red"    onclick="bulkReject()">✗ Reject All</button>
      <button class="bulk-action-btn export" onclick="bulkExportSelected()">⬇ Export Selected</button>
      <button class="bulk-action-btn clear"  onclick="bulkSelectAll(false)">✕ Clear</button>
    </div>
    <div class="table-toolbar">
      <label class="bulk-checkbox" style="margin-right:4px" title="Select all">
        <input type="checkbox" id="bulkSelectAll" onchange="bulkSelectAll(this.checked)"><span class="bulk-box"></span>
      </label>
      <input type="text" class="table-search" id="stmtSearch" placeholder="🔍  Search client or account…" oninput="filterStmtTable(this.value)" />
      <span class="table-count" id="stmtCount">${shown.length} record${shown.length !== 1 ? 's' : ''}</span>
      <button class="btn-sm export-btn" onclick="exportStatements()" title="Export to CSV">⬇ Export CSV</button>
    </div>
    <table class="data-table sortable-table" id="statementsTable" data-filter="${filter}">
      <thead><tr>
        <th style="width:36px"></th>
        <th class="sortable" data-sort="client">Client <span class="sort-icon">⇅</span></th>
        <th class="sortable" data-sort="id">Account ID <span class="sort-icon">⇅</span></th>
        <th class="sortable" data-sort="balance">Balance <span class="sort-icon">⇅</span></th>
        <th class="sortable" data-sort="status">Status <span class="sort-icon">⇅</span></th>
        <th class="sortable" data-sort="submitted">Submitted <span class="sort-icon">⇅</span></th>
        <th>Actions</th>
      </tr></thead>
      <tbody id="stmtTbody">
        ${stmtRows(shown)}
      </tbody>
    </table>
    ${shown.length === 0 ? '<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">No statements found</div><div class="empty-sub">Try a different filter or search term.</div></div>' : ''}
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: REPEAT ACCOUNTS
   ════════════════════════════════════════════════ */
function renderRepeatAccounts(filter = 'all') {
  const all   = Store.get('repeatAccounts');
  const shown = filter === 'all' ? all : all.filter(r => r.status === filter);
  const counts = { all: all.length, pending: all.filter(r=>r.status==='pending').length, approved: all.filter(r=>r.status==='approved').length, denied: all.filter(r=>r.status==='denied').length };

  return `
  <div class="page-header">
    <h1>Repeat Account Requests</h1>
    <p>Review clients requesting a second account. Approve or deny based on account history.</p>
  </div>
  <div class="filter-tabs">
    ${['all','pending','approved','denied'].map(f => `
    <button class="filter-tab ${filter === f ? 'active' : ''}" data-action="filter-repeat" data-filter="${f}">
      ${f} <span class="tab-count">${counts[f] || 0}</span>
    </button>`).join('')}
  </div>
  <div class="repeat-list">
    ${shown.map(r => `
    <div class="repeat-card ${r.status !== 'pending' ? 'resolved' : ''}" data-id="${r.id}">
      <div class="repeat-card-left">
        <div class="mini-avatar ${r.color} lg">${r.initials}</div>
        <div>
          <div class="repeat-client">${r.client}</div>
          <div class="repeat-meta">
            <span>Prev: #${r.prevAccount}</span>
            <span>Closed ${r.closedDate}</span>
            <span class="reason-badge">${r.reason}</span>
          </div>
        </div>
      </div>
      <div class="repeat-card-right">
        ${r.status === 'pending' ? `
        <button class="btn-approve" data-action="approve-repeat" data-id="${r.id}">✓ Approve</button>
        <button class="btn-deny"    data-action="deny-repeat"    data-id="${r.id}">✗ Deny</button>` :
        `<span class="status-resolved ${r.status}">${r.status === 'approved' ? '✅ Approved' : '❌ Denied'}</span>`}
      </div>
    </div>`).join('')}
    ${shown.length === 0 ? '<div class="empty-state"><div class="empty-icon">🔄</div><div class="empty-title">No requests here</div><div class="empty-sub">There are no repeat account requests in this category.</div></div>' : ''}
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: CLIENT PROFILES
   ════════════════════════════════════════════════ */
function renderClientProfiles(search = '') {
  const all    = Store.get('clients');
  const shown  = search ? all.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search)) : all;

  return `
  <div class="page-header">
    <h1>Client Profiles</h1>
    <p>View and manage all active client accounts.</p>
  </div>
  <div class="page-toolbar">
    <div class="search-inline">
      <span>🔍</span>
      <input type="text" id="clientSearch" placeholder="Search by name or account ID…" value="${search}" />
    </div>
  </div>
  <div class="widget">
    <table class="data-table">
      <thead><tr><th>Client</th><th>Account ID</th><th>Balance</th><th>Status</th><th>KYC</th><th>Country</th><th>Joined</th></tr></thead>
      <tbody>
        ${shown.map(c => `
        <tr class="clickable-row" data-action="client-detail" data-id="${c.id}">
          <td><div class="client-cell"><div class="mini-avatar ${c.color}">${c.initials}</div>${c.name}</div></td>
          <td>#${c.id}</td><td>${fmt(c.balance)}</td>
          <td>${statusPill(c.status)}</td>
          <td>${kycPill(c.kyc)}</td>
          <td>${c.country}</td>
          <td>${c.joined}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    ${shown.length === 0 ? '<div class="empty-state"><div class="empty-icon">👤</div><div class="empty-title">No clients found</div><div class="empty-sub">No client profiles match your current search.</div></div>' : ''}
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: KYC REVIEWS
   ════════════════════════════════════════════════ */
function renderKycReviews(filter = 'all') {
  const all   = Store.get('kyc');
  const counts = { all: all.length, expired: all.filter(k=>k.status==='expired').length, expiring: all.filter(k=>k.status==='expiring').length, valid: all.filter(k=>k.status==='valid').length };
  const shown = filter === 'all' ? all : all.filter(k => k.status === filter);

  return `
  <div class="page-header">
    <h1>KYC Reviews</h1>
    <p>Track document expiry dates and manage renewal requests.</p>
  </div>
  <div class="filter-tabs">
    ${['all','expired','expiring','valid'].map(f => `
    <button class="filter-tab ${filter === f ? 'active' : ''}" data-action="filter-kyc" data-filter="${f}">
      ${f} <span class="tab-count">${counts[f] || 0}</span>
    </button>`).join('')}
  </div>
  <div class="widget">
    <div class="table-toolbar">
      <span class="table-count">${shown.length} record${shown.length !== 1 ? 's' : ''}</span>
      <button class="btn-sm export-btn" onclick="exportKyc()" title="Export to CSV">⬇ Export CSV</button>
    </div>
    <table class="data-table">
      <thead><tr><th>Client</th><th>Account ID</th><th>Document Type</th><th>Expiry Date</th><th>Days Left</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${shown.map(k => `
        <tr>
          <td><div class="client-cell"><div class="mini-avatar ${k.color}">${k.initials}</div>${k.client}</div></td>
          <td>#${k.accountId}</td>
          <td>${k.docType}</td>
          <td>${k.expiry}</td>
          <td><span class="${k.daysLeft < 0 ? 'text-red' : k.daysLeft < 30 ? 'text-amber' : 'text-green'} fw-600">${k.daysLeft < 0 ? `${Math.abs(k.daysLeft)}d overdue` : k.daysLeft + 'd'}</span></td>
          <td>${kycPill(k.status)}</td>
          <td>
            ${k.status !== 'valid' ? `
            <div class="row-actions">
              <button class="btn-approve" data-action="kyc-renew"  data-id="${k.id}">Mark Renewed</button>
              <button class="btn-sm"      data-action="kyc-notify" data-id="${k.id}">Notify Client</button>
            </div>` : '<span class="muted-text">—</span>'}
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
    ${shown.length === 0 ? '<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-title">All clear in this category</div><div class="empty-sub">No KYC records match this filter right now.</div></div>' : ''}
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: RISK ALERTS
   ════════════════════════════════════════════════ */
function renderRiskAlerts(filter = 'all') {
  const all   = Store.get('alerts');
  const counts = { all: all.length, active: all.filter(a=>a.status==='active').length, resolved: all.filter(a=>a.status==='resolved').length };
  const shown = filter === 'all' ? all : all.filter(a => a.status === filter);

  return `
  <div class="page-header">
    <h1>Risk Alerts</h1>
    <p>Monitor and resolve active risk events across all client accounts.</p>
  </div>
  <div class="filter-tabs">
    ${['all','active','resolved'].map(f => `
    <button class="filter-tab ${filter === f ? 'active' : ''}" data-action="filter-alerts" data-filter="${f}">
      ${f} <span class="tab-count">${counts[f] || 0}</span>
    </button>`).join('')}
  </div>
  <div class="alerts-full-list">
    ${shown.map(a => `
    <div class="alert-full-card ${a.status === 'resolved' ? 'resolved' : ''}" data-id="${a.id}">
      <div class="${severityIcon(a.severity)} lg">${a.icon}</div>
      <div class="alert-full-body">
        <div class="alert-full-top">
          <span class="alert-full-title">${a.title}</span>
          ${a.account ? `<span class="alert-account">#${a.account}</span>` : ''}
          <span class="alert-time-badge">${a.time}</span>
        </div>
        <div class="alert-full-desc">${a.detail}</div>
      </div>
      <div class="alert-full-actions">
        ${a.status === 'active' ? `<button class="btn-approve" data-action="resolve-alert" data-id="${a.id}">Mark Resolved</button>` : '<span class="status-resolved approved">✅ Resolved</span>'}
      </div>
    </div>`).join('')}
    ${shown.length === 0 ? '<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-title">All clear!</div><div class="empty-sub">No risk alerts in this category. Keep an eye on the dashboard for new activity.</div></div>' : ''}
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: EXPOSURE REPORTS
   ════════════════════════════════════════════════ */
function renderExposureReports() {
  const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  return `
  <div class="page-header">
    <h1>Exposure Reports</h1>
    <p>Visualise portfolio risk exposure across currency pairs and timeframes.</p>
    <button class="btn-sm export-btn" onclick="printExposureReport()" style="margin-top:10px;">🖨 Print / Save PDF</button>
  </div>
  <div class="stats-grid" id="exposureStats">
    <div class="stat-card accent-red"><div class="stat-icon">💰</div><div class="stat-label">Total Exposure</div><div class="stat-value">$8.4B</div><div class="stat-sub"><span class="up">↑ 3.2%</span> vs last week</div></div>
    <div class="stat-card accent-amber"><div class="stat-icon">⚠️</div><div class="stat-label">High Risk Accounts</div><div class="stat-value">12</div><div class="stat-sub"><span class="down">2 new</span> this week</div></div>
    <div class="stat-card accent-blue"><div class="stat-icon">📈</div><div class="stat-label">Open Positions</div><div class="stat-value">1,847</div><div class="stat-sub"><span class="muted-text">Across 10 pairs</span></div></div>
    <div class="stat-card accent-green"><div class="stat-icon">✅</div><div class="stat-label">Margin Health</div><div class="stat-value">94%</div><div class="stat-sub"><span class="up">Accounts above 120%</span></div></div>
  </div>
  <div class="widgets-grid" id="exposureCharts">
    <div class="widget">
      <div class="widget-header"><h3>📊 Daily Exposure (Last 14 Days)</h3></div>
      <div class="chart-area-lg"><canvas id="exposureLineChart"></canvas></div>
    </div>
    <div class="widget">
      <div class="widget-header"><h3>🥧 Exposure by Currency Pair</h3></div>
      <div class="chart-area-lg chart-center"><canvas id="exposureDoughnutChart"></canvas></div>
    </div>
  </div>
  <div class="widget" id="exposureTable">
    <div class="widget-header"><h3>📋 Pair Exposure Breakdown</h3><span class="muted-text" style="font-size:12px;">As of ${now}</span></div>
    <table class="data-table">
      <thead><tr><th>Currency Pair</th><th>Exposure ($M)</th><th>% of Portfolio</th><th>Open Positions</th><th>Avg Margin</th><th>Risk Level</th></tr></thead>
      <tbody>
        ${[
          ['EUR/USD', 2688, 32, 591, '142%', 'green'],
          ['USD/JPY', 2016, 24, 444, '138%', 'green'],
          ['GBP/USD', 1512, 18, 333, '121%', 'amber'],
          ['USD/CHF',  1008, 12, 222, '115%', 'amber'],
          ['AUD/USD',  672,  8, 148, '108%', 'red'],
          ['Other',    504,  6, 109, '119%', 'green'],
        ].map(([pair, exp, pct, pos, margin, risk]) => `
        <tr>
          <td><strong>${pair}</strong></td>
          <td>$${exp.toLocaleString()}M</td>
          <td>${pct}%</td>
          <td>${pos.toLocaleString()}</td>
          <td><span class="text-${risk} fw-600">${margin}</span></td>
          <td><span class="pill ${risk}">${risk === 'green' ? 'low' : risk === 'amber' ? 'medium' : 'high'}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function printExposureReport() {
  const content = document.querySelector('.content');
  if (content) {
    const d = new Date();
    content.setAttribute('data-print-date', d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  }
  window.print();
}

function initExposureCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gc = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
  const tc = isDark ? '#94a3b8' : '#64748b';

  const lineCanvas = document.getElementById('exposureLineChart');
  if (lineCanvas) {
    new Chart(lineCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['1 Apr','2','3','4','5','6','7','8','9','10','11','12','13','14 Apr'],
        datasets: [{
          label: 'Total Exposure ($B)',
          data: [7.8, 8.0, 7.9, 8.1, 8.3, 8.0, 7.7, 7.9, 8.2, 8.1, 8.3, 8.5, 8.4, 8.4],
          borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)',
          fill: true, tension: 0.4, pointRadius: 3
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 } }, border: { display: false } }, y: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 } }, border: { display: false }, beginAtZero: false } } }
    });
  }

  const doughnutCanvas = document.getElementById('exposureDoughnutChart');
  if (doughnutCanvas) {
    new Chart(doughnutCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'Other'],
        datasets: [{ data: [32, 24, 18, 12, 8, 6], backgroundColor: ['#3b82f6','#6366f1','#22c55e','#f59e0b','#ef4444','#94a3b8'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: tc, font: { size: 12 }, padding: 14, boxWidth: 12, boxHeight: 12 } } }, cutout: '65%' }
    });
  }
}

/* ════════════════════════════════════════════════
   PAGE: AUDIT LOGS
   ════════════════════════════════════════════════ */
function renderAuditLogs() {
  const logs = Store.get('audit');
  const actionIcon = a => {
    if (a.includes('Login') || a.includes('Logout'))  return { icon: '🔐', cls: 'blue' };
    if (a.includes('Approved') || a.includes('Renewed')) return { icon: '✅', cls: 'green' };
    if (a.includes('Denied') || a.includes('Rejected')) return { icon: '❌', cls: 'red' };
    if (a.includes('Resolved'))  return { icon: '✔️', cls: 'green' };
    if (a.includes('Notified'))  return { icon: '📧', cls: 'blue' };
    if (a.includes('Ticket'))    return { icon: '🎫', cls: 'amber' };
    if (a.includes('Signup'))    return { icon: '👤', cls: 'blue' };
    return { icon: '📝', cls: 'blue' };
  };

  return `
  <div class="page-header">
    <h1>Audit Logs</h1>
    <p>A full timestamped record of all actions taken in this session.</p>
  </div>
  <div class="widget">
    ${logs.length === 0 ? `
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-title">No actions recorded yet</div>
      <div class="empty-sub">Approvals, rejections, and logins will appear here as they happen.</div>
    </div>` : `
    <div class="audit-timeline">
      ${logs.map(l => {
        const { icon, cls } = actionIcon(l.action);
        return `
        <div class="audit-entry">
          <div class="audit-dot ${cls}">${icon}</div>
          <div class="audit-content">
            <div class="audit-action">${l.action} — <span class="audit-target">${l.target}</span></div>
            ${l.detail ? `<div class="audit-detail">${l.detail}</div>` : ''}
            <div class="audit-meta">${l.timestamp} · ${l.user}</div>
          </div>
        </div>`;
      }).join('')}
    </div>`}
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: SUPPORT EMAILS
   ════════════════════════════════════════════════ */
function renderSupportEmails() {
  const emails = Store.get('emails');
  const active = selectedEmailId ? emails.find(e => e.id === selectedEmailId) : null;

  return `
  <div class="page-header">
    <h1>Support Emails</h1>
    <p>Manage client support correspondence.</p>
  </div>
  <div class="email-split">
    <div class="email-sidebar-panel">
      <div class="email-panel-header">
        <span>${emails.filter(e=>!e.read).length} unread</span>
        <button class="btn-primary btn-sm-primary" data-action="compose-email">✏️ Compose</button>
      </div>
      <div class="email-list-panel">
        ${emails.map(e => `
        <div class="email-row ${e.read ? '' : 'unread'} ${selectedEmailId === e.id ? 'selected' : ''}" data-action="select-email" data-id="${e.id}">
          <div class="email-dot ${e.read ? 'invisible' : ''}"></div>
          <div class="email-row-body">
            <div class="email-row-top">
              <span class="email-row-from">${e.from}</span>
              <span class="email-row-time">${e.time}</span>
            </div>
            <div class="email-row-subject">${e.subject}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="email-content-panel">
      ${active ? `
      <div class="email-view">
        <div class="email-view-header">
          <h3>${active.subject}</h3>
          <div class="email-view-meta">From: <strong>${active.from}</strong>${active.accountId ? ' · #' + active.accountId : ''} · ${active.time}</div>
        </div>
        <div class="email-view-body">${active.body.replace(/\n/g,'<br/>')}</div>
        <div class="email-view-footer">
          <button class="btn-primary" data-action="reply-email" data-id="${active.id}">↩ Reply</button>
          <button class="btn-sm" data-action="forward-email" data-id="${active.id}">→ Forward</button>
        </div>
      </div>` : `
      <div class="email-empty-state">
        <div style="font-size:48px;margin-bottom:16px;">📬</div>
        <div>Select an email to read it</div>
      </div>`}
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: TICKETS
   ════════════════════════════════════════════════ */
function renderTickets(filter = 'all') {
  const all   = Store.get('tickets');
  const counts = { all: all.length, open: all.filter(t=>t.status==='open').length, 'in-progress': all.filter(t=>t.status==='in-progress').length, closed: all.filter(t=>t.status==='closed').length };
  const shown = filter === 'all' ? all : all.filter(t => t.status === filter);

  return `
  <div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between;">
    <div>
      <h1>Tickets</h1>
      <p>Track and resolve client support tickets.</p>
    </div>
    <button class="btn-primary" data-action="new-ticket">+ New Ticket</button>
  </div>
  <div class="filter-tabs">
    ${['all','open','in-progress','closed'].map(f => `
    <button class="filter-tab ${filter === f ? 'active' : ''}" data-action="filter-tickets" data-filter="${f}">
      ${f.replace('-',' ')} <span class="tab-count">${counts[f] || 0}</span>
    </button>`).join('')}
  </div>
  <div class="tickets-list">
    ${shown.map(t => `
    <div class="ticket-card ${t.status === 'closed' ? 'closed' : ''}" data-action="ticket-detail" data-id="${t.id}">
      <div class="ticket-card-top">
        <span class="ticket-id">${t.id}</span>
        ${priorityPill(t.priority)}
        ${ticketStatusPill(t.status)}
      </div>
      <div class="ticket-subject">${t.subject}</div>
      <div class="ticket-meta">
        <span>👤 ${t.client}${t.accountId ? ' · #' + t.accountId : ''}</span>
        <span>🕐 ${t.created}</span>
        <span>👷 ${t.assignee}</span>
      </div>
      <div class="ticket-desc">${t.desc}</div>
      ${t.status !== 'closed' ? `
      <div class="ticket-actions">
        ${t.status === 'open' ? `<button class="btn-sm" data-action="ticket-progress" data-id="${t.id}">Start Progress</button>` : ''}
        <button class="btn-sm btn-danger" data-action="ticket-close" data-id="${t.id}">Close Ticket</button>
      </div>` : ''}
    </div>`).join('')}
    ${shown.length === 0 ? '<div class="empty-state"><div class="empty-icon">🎫</div><div class="empty-title">No tickets</div><div class="empty-sub">No support tickets in this category right now.</div></div>' : ''}
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: PREFERENCES
   ════════════════════════════════════════════════ */
function renderPreferences() {
  const prefs = Store.get('preferences');
  const theme = document.documentElement.getAttribute('data-theme');
  const notif = prefs?.notifications || {};

  return `
  <div class="page-header">
    <h1>Preferences</h1>
    <p>Manage your profile, appearance, and notification settings.</p>
  </div>
  <div class="prefs-grid">
    <div class="widget pref-section">
      <div class="widget-header"><h3>👤 Profile</h3></div>
      <div class="pref-body">
        <div class="pref-field">
          <label>Full name</label>
          <input type="text" id="prefName" value="${currentUser?.name || ''}" />
        </div>
        <div class="pref-field">
          <label>Email address</label>
          <input type="email" id="prefEmail" value="${currentUser?.email || ''}" />
        </div>
        <div class="pref-field">
          <label>Role</label>
          <input type="text" value="Risk Management Agent" disabled />
        </div>
        <button class="btn-primary" data-action="save-profile">Save Profile</button>
      </div>
    </div>

    <div class="widget pref-section">
      <div class="widget-header"><h3>🎨 Appearance</h3></div>
      <div class="pref-body">
        <div class="pref-row">
          <div>
            <div class="pref-label">Theme</div>
            <div class="pref-sub">Switch between dark and light mode</div>
          </div>
          <div class="theme-switch-row">
            <button class="theme-opt ${theme === 'dark' ? 'active' : ''}" data-action="set-theme" data-theme="dark">🌙 Dark</button>
            <button class="theme-opt ${theme === 'light' ? 'active' : ''}" data-action="set-theme" data-theme="light">☀️ Light</button>
          </div>
        </div>
        <div class="pref-row" style="align-items:flex-start;flex-direction:column;gap:10px;">
          <div>
            <div class="pref-label">Sidebar accent colour</div>
            <div class="pref-sub">Colour used for active navigation links and filter tabs</div>
          </div>
          <div class="avatar-color-grid">
            ${AVATAR_COLORS.map(c => {
              const sel = (prefs?.accentColor || 'blue') === c.id;
              return `<div class="avatar-swatch${sel ? ' selected' : ''}"
                data-action="set-accent-color" data-color="${c.id}"
                style="background:${c.bg}" title="${c.id}">${sel ? '✓' : ''}</div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="widget pref-section">
      <div class="widget-header"><h3>🔔 Notifications</h3></div>
      <div class="pref-body">
        ${[
          ['riskAlerts',     'Risk Alerts',          'Get notified when new risk alerts are triggered'],
          ['kycExpiry',      'KYC Expiry Warnings',  'Alert when client documents are near expiry'],
          ['repeatAccounts', 'Repeat Account Alerts','Notify on repeat account detection'],
          ['newEmails',      'New Support Emails',    'Badge count for unread support emails'],
          ['systemUpdates',  'System Updates',        'Regulatory bulletins and platform news'],
        ].map(([key, label, sub]) => `
        <div class="pref-row">
          <div>
            <div class="pref-label">${label}</div>
            <div class="pref-sub">${sub}</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" data-action="toggle-notif" data-key="${key}" ${notif[key] ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>`).join('')}
      </div>
    </div>

    <div class="widget pref-section">
      <div class="widget-header"><h3>🗑️ Data</h3></div>
      <div class="pref-body">
        <div class="pref-row">
          <div>
            <div class="pref-label">Reset demo data</div>
            <div class="pref-sub">Restore all accounts, alerts, and emails to their original state</div>
          </div>
          <button class="btn-sm btn-danger" data-action="reset-data">Reset</button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════
   PAGE: FOREX ACCOUNTS
   ════════════════════════════════════════════════ */
function renderForexAccounts() {
  return `
    <div class="page-header">
      <div>
        <h1>Forex Accounts</h1>
        <p class="page-sub">Manage all client trading accounts</p>
      </div>
      <button class="btn-primary" data-action="fx-add">+ Add New Account</button>
    </div>
    <div id="fxApiError" class="error-msg" style="margin-bottom:16px;display:none;"></div>
    <div class="card" style="padding:0;overflow:hidden;">
      <div id="fxTableWrap" style="overflow-x:auto;">
        <div style="padding:48px;text-align:center;color:var(--muted);">Loading accounts…</div>
      </div>
    </div>`;
}

async function loadForexAccounts() {
  const wrap = document.getElementById('fxTableWrap');
  const errEl = document.getElementById('fxApiError');
  if (!wrap) return;

  try {
    const res  = await fetch(`${API_BASE}/forex-accounts`);
    const json = await res.json();

    if (!res.ok) {
      showFxError(json.message || 'Failed to load accounts.');
      wrap.innerHTML = '<div style="padding:48px;text-align:center;color:var(--muted);">Could not load accounts.</div>';
      return;
    }

    const accounts = json.data;

    if (!accounts.length) {
      wrap.innerHTML = `
        <div style="padding:64px;text-align:center;">
          <div style="font-size:40px;margin-bottom:12px;">💱</div>
          <div style="font-weight:600;margin-bottom:6px;">No accounts yet</div>
          <div style="color:var(--muted);font-size:14px;">Click "Add New Account" to create the first one.</div>
        </div>`;
      return;
    }

    wrap.innerHTML = `
      <table class="data-table" id="fxTable">
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Client</th>
            <th>Country</th>
            <th>Balance</th>
            <th>Status</th>
            <th>KYC</th>
            <th>Statement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${accounts.map(a => `
            <tr>
              <td><span style="font-family:monospace;font-size:13px;">${a.id}</span></td>
              <td>
                <div style="font-weight:600;">${a.clientName}</div>
                <div style="font-size:12px;color:var(--muted);">${a.email}</div>
              </td>
              <td>${a.country || '—'}</td>
              <td style="font-weight:600;">$${Number(a.balance).toLocaleString()}</td>
              <td>${fxPill(a.status, { active:'green', flagged:'red', suspended:'red' })}</td>
              <td>${fxPill(a.kycStatus, { valid:'green', expiring:'amber', expired:'red' })}</td>
              <td>${a.statementStatus ? fxPill(a.statementStatus, { pending:'amber', 'in-review':'blue', approved:'green', flagged:'red', rejected:'red' }) : '<span style="color:var(--muted)">—</span>'}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn-sm btn-ghost" data-action="fx-edit" data-id="${a.id}" title="Edit">✏️</button>
                  <button class="btn-sm btn-danger" data-action="fx-delete" data-id="${a.id}" data-name="${a.clientName}" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } catch {
    showFxError('Cannot reach server. Make sure the backend is running.');
    wrap.innerHTML = '<div style="padding:48px;text-align:center;color:var(--muted);">Could not connect to server.</div>';
  }
}

function fxPill(value, colorMap) {
  const color = colorMap[value] || 'blue';
  return `<span class="pill ${color}">${value.replace('-', ' ')}</span>`;
}

function showFxError(msg) {
  const el = document.getElementById('fxApiError');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.classList.add('show');
}

function clearFxError() {
  const el = document.getElementById('fxApiError');
  if (el) { el.style.display = 'none'; el.classList.remove('show'); }
}

function openFxAddModal() {
  openModal('Add New Account', `
    <div id="fxFormError" class="error-msg" style="margin-bottom:12px;"></div>
    <div class="pref-field"><label>Account ID <span style="color:var(--danger)">*</span></label>
      <input type="text" id="fxId" placeholder="e.g. FX-00500" /></div>
    <div class="pref-field"><label>Client Name <span style="color:var(--danger)">*</span></label>
      <input type="text" id="fxClientName" placeholder="Full name" /></div>
    <div class="pref-field"><label>Email <span style="color:var(--danger)">*</span></label>
      <input type="email" id="fxEmail" placeholder="client@email.com" /></div>
    <div class="pref-field"><label>Phone</label>
      <input type="text" id="fxPhone" placeholder="+44 7911 000000" /></div>
    <div class="pref-field"><label>Country</label>
      <input type="text" id="fxCountry" placeholder="e.g. Germany" /></div>
    <div class="pref-field"><label>Balance ($)</label>
      <input type="number" id="fxBalance" placeholder="0" min="0" /></div>
    <div class="pref-field"><label>Currency Pair</label>
      <input type="text" id="fxCurrencyPair" placeholder="e.g. EUR/USD" /></div>
    <div class="pref-field"><label>Account Status</label>
      <select id="fxStatus">
        <option value="active">Active</option>
        <option value="flagged">Flagged</option>
        <option value="suspended">Suspended</option>
      </select></div>
    <div class="pref-field"><label>KYC Status</label>
      <select id="fxKycStatus">
        <option value="valid">Valid</option>
        <option value="expiring">Expiring</option>
        <option value="expired">Expired</option>
      </select></div>
    <div class="pref-field"><label>Statement Status</label>
      <select id="fxStatementStatus">
        <option value="">— None —</option>
        <option value="pending">Pending</option>
        <option value="in-review">In Review</option>
        <option value="approved">Approved</option>
        <option value="flagged">Flagged</option>
        <option value="rejected">Rejected</option>
      </select></div>
    <div class="modal-actions">
      <button class="btn-ghost" data-action="fx-cancel">Cancel</button>
      <button class="btn-primary" data-action="fx-save-new">Save Account</button>
    </div>`);
}

function openFxEditModal(account) {
  openModal('Edit Account', `
    <div id="fxFormError" class="error-msg" style="margin-bottom:12px;"></div>
    <input type="hidden" id="fxEditId" value="${account.id}" />
    <div class="pref-field"><label>Account ID</label>
      <input type="text" value="${account.id}" disabled style="opacity:.5;" /></div>
    <div class="pref-field"><label>Client Name</label>
      <input type="text" id="fxClientName" value="${account.clientName}" /></div>
    <div class="pref-field"><label>Email</label>
      <input type="email" id="fxEmail" value="${account.email}" /></div>
    <div class="pref-field"><label>Phone</label>
      <input type="text" id="fxPhone" value="${account.phone || ''}" /></div>
    <div class="pref-field"><label>Country</label>
      <input type="text" id="fxCountry" value="${account.country || ''}" /></div>
    <div class="pref-field"><label>Balance ($)</label>
      <input type="number" id="fxBalance" value="${account.balance}" min="0" /></div>
    <div class="pref-field"><label>Currency Pair</label>
      <input type="text" id="fxCurrencyPair" value="${account.currencyPair || ''}" /></div>
    <div class="pref-field"><label>Account Status</label>
      <select id="fxStatus">
        <option value="active"    ${account.status === 'active'    ? 'selected' : ''}>Active</option>
        <option value="flagged"   ${account.status === 'flagged'   ? 'selected' : ''}>Flagged</option>
        <option value="suspended" ${account.status === 'suspended' ? 'selected' : ''}>Suspended</option>
      </select></div>
    <div class="pref-field"><label>KYC Status</label>
      <select id="fxKycStatus">
        <option value="valid"     ${account.kycStatus === 'valid'    ? 'selected' : ''}>Valid</option>
        <option value="expiring"  ${account.kycStatus === 'expiring' ? 'selected' : ''}>Expiring</option>
        <option value="expired"   ${account.kycStatus === 'expired'  ? 'selected' : ''}>Expired</option>
      </select></div>
    <div class="pref-field"><label>Statement Status</label>
      <select id="fxStatementStatus">
        <option value=""          ${!account.statementStatus                      ? 'selected' : ''}>— None —</option>
        <option value="pending"   ${account.statementStatus === 'pending'         ? 'selected' : ''}>Pending</option>
        <option value="in-review" ${account.statementStatus === 'in-review'       ? 'selected' : ''}>In Review</option>
        <option value="approved"  ${account.statementStatus === 'approved'        ? 'selected' : ''}>Approved</option>
        <option value="flagged"   ${account.statementStatus === 'flagged'         ? 'selected' : ''}>Flagged</option>
        <option value="rejected"  ${account.statementStatus === 'rejected'        ? 'selected' : ''}>Rejected</option>
      </select></div>
    <div class="modal-actions">
      <button class="btn-ghost" data-action="fx-cancel">Cancel</button>
      <button class="btn-primary" data-action="fx-save-edit">Save Changes</button>
    </div>`);
}

/* ════════════════════════════════════════════════
   PAGE: MY PROFILE
   ════════════════════════════════════════════════ */
function renderProfile() {
  const u          = currentUser;
  const isPhoto    = u.avatarType === 'photo'  && u.avatarValue;
  const isEmoji    = u.avatarType === 'emoji'  && u.avatarValue;
  const isDemo     = u.email === DEMO_ACCOUNT.email;
  const actions    = Store.get('audit').filter(a => /Approved|Resolved|Closed|Renewed/.test(a.action)).length;
  const displayIni = (u.avatarCustomInitials || u.name.split(' ').map(w => w[0]).join('')).slice(0, 2).toUpperCase();
  const avatarBg   = getAvatarBg(u);
  const customHex  = (u.avatarType === 'custom' && u.avatarValue) ? u.avatarValue : '#6366f1';

  /* ── Hero avatar style ── */
  const heroStyle = isPhoto
    ? `background:url(${u.avatarValue}) center/cover no-repeat;border:2px solid var(--border)`
    : `background:${avatarBg};${isEmoji ? 'font-size:42px;border:2px solid var(--border)' : ''}`;
  const heroContent = isPhoto ? '' : isEmoji ? u.avatarValue : displayIni;

  /* ── Colour tab HTML ── */
  const colorSwatches = AVATAR_COLORS.map(c => {
    const sel = (u.avatarType !== 'emoji' && u.avatarType !== 'photo' && (u.avatarValue || nameToColorId(u.name)) === c.id);
    return `<div class="avatar-swatch${sel ? ' selected' : ''}" data-action="set-avatar-color" data-color="${c.id}"
              style="background:${c.bg}" title="${c.id}">${sel ? '✓' : ''}</div>`;
  }).join('');

  /* ── Emoji tab HTML ── */
  const emojiGrid = AVATAR_EMOJIS.map(em => {
    const sel = isEmoji && u.avatarValue === em;
    return `<div class="avatar-emoji-opt${sel ? ' selected' : ''}" data-action="set-avatar-emoji" data-emoji="${em}">${em}</div>`;
  }).join('');

  /* ── Photo tab HTML ── */
  const photoPanel = isPhoto ? `
    <div class="photo-current-wrap">
      <div class="photo-preview-circle" style="background:url(${u.avatarValue}) center/cover no-repeat"></div>
      <div>
        <div style="font-size:14px;font-weight:600;margin-bottom:8px;">Current photo</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <label class="btn-sm" style="cursor:pointer;">
            ↑ Change photo
            <input type="file" id="photoInput" accept="image/*" style="display:none">
          </label>
          <button class="btn-sm btn-danger" data-action="remove-photo">✕ Remove</button>
        </div>
      </div>
    </div>` : `
    <div class="photo-upload-zone" id="photoUploadZone" data-action="photo-upload-zone">
      <input type="file" id="photoInput" accept="image/*" style="display:none">
      <div style="font-size:36px;margin-bottom:10px">📷</div>
      <div style="font-size:14px;font-weight:600;">Click to upload a photo</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px;">JPG, PNG or GIF · Stored locally</div>
    </div>
    <div id="photoPreviewWrap" style="display:none;">
      <div class="photo-preview-wrap">
        <div class="photo-preview-circle" id="photoPreviewCircle"></div>
        <div>
          <div style="font-size:14px;font-weight:600;margin-bottom:10px;">Looking good!</div>
          <div style="display:flex;gap:10px;">
            <button class="btn-primary" data-action="confirm-photo">✓ Use this photo</button>
            <button class="btn-sm"      data-action="cancel-photo">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;

  const tab = activeAvatarTab;

  return `
  <div class="page-header">
    <h1>My Profile</h1>
    <p>Manage your account info, avatar, and security settings.</p>
  </div>

  <div class="profile-grid">

    <!-- ── Hero card ── -->
    <div class="widget profile-card" style="grid-column:1/-1">
      <div class="profile-hero">
        <div class="profile-avatar-lg" style="${heroStyle}">${heroContent}</div>
        <div class="profile-hero-info">
          <div class="profile-name">${u.name}</div>
          <div class="profile-email-text">${u.email}</div>
          <span class="profile-role-tag">Risk Management Agent</span>
        </div>
        <div class="profile-stats-row">
          <div class="profile-stat"><div class="profile-stat-val">${u.loginCount || 1}</div><div class="profile-stat-lbl">Logins</div></div>
          <div class="profile-stat"><div class="profile-stat-val">${actions}</div><div class="profile-stat-lbl">Actions</div></div>
          <div class="profile-stat"><div class="profile-stat-val">${u.joinedDate || 'Today'}</div><div class="profile-stat-lbl">Member Since</div></div>
          <div class="profile-stat"><div class="profile-stat-val">${u.lastActive || 'Today'}</div><div class="profile-stat-lbl">Last Active</div></div>
        </div>
      </div>
    </div>

    <!-- ── Edit info ── -->
    <div class="widget pref-section">
      <div class="widget-header"><h3>✏️ Edit Info</h3></div>
      <div class="pref-body">
        <div class="pref-field"><label>Display Name</label><input type="text" id="profName" value="${u.name}" /></div>
        <div class="pref-field"><label>Email</label><input type="email" id="profEmail" value="${u.email}"${isDemo ? ' disabled title="Demo email cannot be changed"' : ''} /></div>
        <div class="pref-field"><label>Role</label><input type="text" value="Risk Management Agent" disabled /></div>
        <button class="btn-primary" data-action="profile-save-info">Save Changes</button>
      </div>
    </div>

    <!-- ── Avatar picker ── -->
    <div class="widget pref-section">
      <div class="widget-header"><h3>🖼️ Avatar</h3></div>
      <div class="pref-body">

        <!-- Tab bar -->
        <div class="av-tab-bar">
          <button class="av-tab ${tab === 'color' ? 'active' : ''}" data-action="avatar-tab" data-tab="color">🎨 Colour</button>
          <button class="av-tab ${tab === 'emoji' ? 'active' : ''}" data-action="avatar-tab" data-tab="emoji">😀 Emoji</button>
          <button class="av-tab ${tab === 'photo' ? 'active' : ''}" data-action="avatar-tab" data-tab="photo">📷 Photo</button>
        </div>

        <!-- Colour & Initials tab -->
        <div class="av-panel ${tab !== 'color' ? 'av-hidden' : ''}">
          <div class="av-section-label">PRESET COLOURS</div>
          <div class="avatar-color-grid">${colorSwatches}</div>

          <div class="av-section-label" style="margin-top:18px">CUSTOM COLOUR</div>
          <div class="custom-color-row">
            <input type="color" id="customAvatarColor" value="${customHex}" title="Pick any colour">
            <span style="font-size:13px;color:var(--muted);">Pick any colour for your avatar background</span>
          </div>

          <div class="av-section-label" style="margin-top:18px">CUSTOM INITIALS</div>
          <div class="custom-initials-row">
            <input type="text" id="customInitials" maxlength="2" placeholder="${displayIni}"
              value="${u.avatarCustomInitials || ''}"
              style="width:60px;text-align:center;font-size:18px;font-weight:700;text-transform:uppercase;" />
            <button class="btn-sm" data-action="save-custom-initials">Apply</button>
            <span style="font-size:12px;color:var(--muted);">Blank = use name (${displayIni})</span>
          </div>
        </div>

        <!-- Emoji tab -->
        <div class="av-panel ${tab !== 'emoji' ? 'av-hidden' : ''}">
          <div class="avatar-emoji-grid">${emojiGrid}</div>
        </div>

        <!-- Photo tab -->
        <div class="av-panel ${tab !== 'photo' ? 'av-hidden' : ''}">
          ${photoPanel}
        </div>

      </div>
    </div>

    <!-- ── Login history ── -->
    ${(() => {
      const history = JSON.parse(localStorage.getItem(`fg-login-history-${u.email}`) || '[]');
      return `
    <div class="widget pref-section" style="grid-column:1/-1">
      <div class="widget-header"><h3>🕐 Login History</h3><span class="muted-text" style="font-size:12px">Last ${Math.min(history.length, 10)} sign-ins</span></div>
      <div class="pref-body" style="padding:0">
        ${history.length === 0
          ? '<div class="empty-state" style="padding:32px 0"><div class="empty-icon">🔐</div><div class="empty-title">No history yet</div><div class="empty-sub">Sign in again to start recording your login history.</div></div>'
          : `<div class="login-history-list">
              ${history.map((h, i) => `
              <div class="login-hist-row ${i === 0 ? 'current' : ''}">
                <div class="lh-icon">${i === 0 ? '🟢' : '🔵'}</div>
                <div class="lh-info">
                  <div class="lh-time">${h.time}</div>
                  <div class="lh-device">${h.device}</div>
                </div>
                ${i === 0 ? '<span class="pill green" style="font-size:10px">This session</span>' : ''}
              </div>`).join('')}
             </div>`
        }
      </div>
    </div>`;
    })()}

    <!-- ── Change password ── -->
    <div class="widget pref-section" style="grid-column:1/-1">
      <div class="widget-header"><h3>🔐 Change Password</h3></div>
      <div class="pref-body" style="max-width:420px">
        ${isDemo
          ? `<div class="demo-hint"><span class="demo-label">Demo Account</span><span>Password changes are disabled for the demo account.</span></div>`
          : `<div id="pwMsg" class="error-msg"></div>
             <div class="pref-field"><label>Current password</label><input type="password" id="pwCurrent" placeholder="••••••••" /></div>
             <div class="pref-field"><label>New password</label><input type="password" id="pwNew" placeholder="Min. 6 characters" /></div>
             <div class="pref-field"><label>Confirm new password</label><input type="password" id="pwConfirm" placeholder="Repeat new password" /></div>
             <button class="btn-primary" data-action="profile-change-pw">Update Password</button>`
        }
      </div>
    </div>

  </div>`;
}

/* ════════════════════════════════════════════════
   SEARCH
   ════════════════════════════════════════════════ */
function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  document.getElementById('searchInput').focus();
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchInput').value = '';
}

function handleSearch(query) {
  if (!query.trim()) return;
  closeSearch();
  // Navigate to client profiles with search pre-filled
  currentPage = 'client-profiles';
  document.getElementById('topbarTitle').textContent = 'Client Profiles';
  document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.toggle('active', l.dataset.page === 'client-profiles'));
  document.getElementById('mainContent').innerHTML = renderClientProfiles(query);
}

/* ════════════════════════════════════════════════
   MODALS (detail views)
   ════════════════════════════════════════════════ */
function openStatementDetail(id) {
  const s = Store.get('statements').find(s => s.id === id);
  if (!s) return;
  openModal(`Statement — #${s.id}`, `
    <div class="modal-detail-grid">
      <div class="detail-row"><span>Client</span><strong>${s.client}</strong></div>
      <div class="detail-row"><span>Account ID</span><strong>#${s.id}</strong></div>
      <div class="detail-row"><span>Balance</span><strong>${fmt(s.balance)}</strong></div>
      <div class="detail-row"><span>Status</span>${statusPill(s.status)}</div>
      <div class="detail-row"><span>Submitted</span><strong>${s.submitted}</strong></div>
    </div>
    ${s.status !== 'approved' && s.status !== 'rejected' ? `
    <div class="modal-actions">
      <button class="btn-approve" data-action="approve-stmt" data-id="${s.id}" data-close="true">✓ Approve Statement</button>
      <button class="btn-deny"    data-action="reject-stmt"  data-id="${s.id}" data-close="true">✗ Reject Statement</button>
    </div>` : `<div class="modal-actions"><span class="muted-text">This statement has already been ${s.status}.</span></div>`}
  `);
}

function openAlertDetail(id) {
  const a = Store.get('alerts').find(a => a.id === id);
  if (!a) return;
  openModal(`Alert — ${a.title}`, `
    <div class="alert-detail-header ${a.severity}">
      <span class="alert-detail-icon">${a.icon}</span>
      <div>
        ${a.account ? `<div class="muted-text" style="font-size:13px;margin-bottom:4px;">Account #${a.account}</div>` : ''}
        <div style="font-size:13px;color:var(--muted)">${a.time}</div>
      </div>
    </div>
    <p style="font-size:14px;line-height:1.7;color:var(--muted);margin:20px 0;">${a.detail}</p>
    ${a.status === 'active' ? `
    <div class="modal-actions">
      <button class="btn-approve" data-action="resolve-alert" data-id="${a.id}" data-close="true">✓ Mark Resolved</button>
    </div>` : '<div class="modal-actions"><span class="muted-text">✅ This alert has been resolved.</span></div>'}
  `);
}

function openClientDetail(id) {
  const c = Store.get('clients').find(c => c.id === id);
  if (!c) return;
  openModal(`Client Profile — ${c.name}`, `
    <div class="client-detail-header">
      <div class="mini-avatar ${c.color} xl">${c.initials}</div>
      <div>
        <div style="font-size:18px;font-weight:700;">${c.name}</div>
        <div class="muted-text">#${c.id} · ${c.country}</div>
      </div>
    </div>
    <div class="modal-detail-grid">
      <div class="detail-row"><span>Email</span><strong>${c.email}</strong></div>
      <div class="detail-row"><span>Phone</span><strong>${c.phone}</strong></div>
      <div class="detail-row"><span>Balance</span><strong>${fmt(c.balance)}</strong></div>
      <div class="detail-row"><span>Status</span>${statusPill(c.status)}</div>
      <div class="detail-row"><span>KYC Status</span>${kycPill(c.kyc)}</div>
      <div class="detail-row"><span>Primary Pair</span><strong>${c.currency}</strong></div>
      <div class="detail-row"><span>Joined</span><strong>${c.joined}</strong></div>
    </div>
  `);
}

function openTicketDetail(id) {
  const t = Store.get('tickets').find(t => t.id === id);
  if (!t) return;
  openModal(`Ticket ${t.id}`, `
    <div class="modal-detail-grid">
      <div class="detail-row"><span>Client</span><strong>${t.client}</strong></div>
      <div class="detail-row"><span>Account</span><strong>${t.accountId ? '#' + t.accountId : '—'}</strong></div>
      <div class="detail-row"><span>Priority</span>${priorityPill(t.priority)}</div>
      <div class="detail-row"><span>Status</span>${ticketStatusPill(t.status)}</div>
      <div class="detail-row"><span>Assignee</span><strong>${t.assignee}</strong></div>
      <div class="detail-row"><span>Created</span><strong>${t.created}</strong></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:var(--surface2);border-radius:8px;font-size:14px;color:var(--muted);line-height:1.65;">${t.desc}</div>
    ${t.status !== 'closed' ? `
    <div class="modal-actions">
      ${t.status === 'open' ? `<button class="btn-approve" data-action="ticket-progress" data-id="${t.id}" data-close="true">Start Progress</button>` : ''}
      <button class="btn-deny" data-action="ticket-close" data-id="${t.id}" data-close="true">Close Ticket</button>
    </div>` : ''}
  `);
}

function openComposeModal() {
  openModal('Compose Email', `
    <div class="compose-form">
      <div class="pref-field"><label>To</label><input type="text" id="composeTo" placeholder="Client name or email…" /></div>
      <div class="pref-field"><label>Subject</label><input type="text" id="composeSubject" placeholder="Email subject…" /></div>
      <div class="pref-field"><label>Message</label><textarea id="composeBody" rows="6" placeholder="Write your message…"></textarea></div>
      <div class="modal-actions"><button class="btn-primary" data-action="send-email">Send Email</button></div>
    </div>
  `);
}

function openReplyModal(id) {
  const e = Store.get('emails').find(e => e.id === id);
  if (!e) return;
  openModal(`Reply to ${e.from}`, `
    <div class="compose-form">
      <div class="pref-field"><label>To</label><input type="text" value="${e.from}" disabled /></div>
      <div class="pref-field"><label>Subject</label><input type="text" value="RE: ${e.subject}" disabled /></div>
      <div class="pref-field"><label>Message</label><textarea id="composeBody" rows="6" placeholder="Write your reply…"></textarea></div>
      <div class="modal-actions"><button class="btn-primary" data-action="send-reply" data-id="${id}">Send Reply</button></div>
    </div>
  `);
}

function openNewTicketModal() {
  openModal('Create New Ticket', `
    <div class="compose-form">
      <div class="pref-field"><label>Client Name</label><input type="text" id="tkClient" placeholder="e.g. Marcus Klein" /></div>
      <div class="pref-field"><label>Account ID</label><input type="text" id="tkAccount" placeholder="e.g. FX-00412" /></div>
      <div class="pref-field"><label>Subject</label><input type="text" id="tkSubject" placeholder="Brief description of the issue…" /></div>
      <div class="pref-field">
        <label>Priority</label>
        <select id="tkPriority"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select>
      </div>
      <div class="pref-field"><label>Description</label><textarea id="tkDesc" rows="4" placeholder="Full details of the issue…"></textarea></div>
      <div class="modal-actions"><button class="btn-primary" data-action="create-ticket">Create Ticket</button></div>
    </div>
  `);
}

/* ════════════════════════════════════════════════
   EVENT DELEGATION
   ════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Init theme ── */
  applyTheme(localStorage.getItem('fg-theme') || 'dark');

  /* ── Session restore (30-min window) ── */
  const savedSession = loadSession();
  if (savedSession) {
    currentUser = savedSession;
    extendSession();          // reset the 30-min timer on page load
    initDashboard();
    showScreen('dashboard');
    navigate('dashboard');
  } else {
    showScreen(location.hash === '#signup' ? 'signup' : 'login');
  }

  /* ── Auth ── */
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('signupBtn').addEventListener('click', handleSignup);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('goToSignup').addEventListener('click', e => { e.preventDefault(); showScreen('signup'); });
  document.getElementById('goToLogin').addEventListener('click',  e => { e.preventDefault(); showScreen('login'); });

  /* ── Mobile bottom nav ── */
  document.querySelectorAll('.mbn-item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.page));
  });

  /* ── Topbar ── */
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('notifBtn').addEventListener('click', e => { e.stopPropagation(); toggleNotifications(); });
  document.getElementById('searchBtn').addEventListener('click', openSearch);

  /* ── Avatar dropdown ── */
  document.getElementById('avatarBtn').addEventListener('click', e => {
    e.stopPropagation();
    const menu = document.getElementById('avatarMenu');
    document.getElementById('avatarMenuHeader').innerHTML = `
      <div style="font-size:13px;font-weight:700;">${currentUser?.name || 'Agent'}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px;">${currentUser?.email || ''}</div>`;
    menu.classList.toggle('open');
  });
  document.getElementById('avatarMenu').addEventListener('click', e => {
    const item = e.target.closest('[data-avatar-nav]');
    document.getElementById('avatarMenu').classList.remove('open');
    if (item) { navigate(item.dataset.avatarNav); return; }
    if (e.target.id === 'avatarMenuLogout') handleLogout();
  });
  document.addEventListener('click', e => {
    const menu = document.getElementById('avatarMenu');
    if (menu?.classList.contains('open') && !menu.contains(e.target) && e.target.id !== 'avatarBtn') {
      menu.classList.remove('open');
    }
  });

  /* ── Sidebar nav ── */
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', () => navigate(link.dataset.page));
  });

  /* ── Modal close ── */
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => { if (e.target === document.getElementById('modal')) closeModal(); });

  /* ── Notifications panel close on outside click ── */
  document.addEventListener('click', e => {
    const panel = document.getElementById('notifPanel');
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target.id !== 'notifBtn') {
      panel.classList.remove('open');
    }
  });

  /* ── Notifications panel items ── */
  document.getElementById('notifPanel').addEventListener('click', e => {
    const panel = document.getElementById('notifPanel');

    /* ── Clear All ── */
    if (e.target.id === 'clearNotifs') {
      Store.get('alerts').filter(a => a.status === 'active').forEach(a =>
        Store.update('alerts', a.id, { notifDismissed: true })
      );
      Store.get('emails').filter(em => !em.read).forEach(em =>
        Store.update('emails', em.id, { read: true })
      );
      renderNotifications();
      updateSidebarBadges();
      panel.classList.remove('open');
      showToast('All notifications cleared.', 'info');
      return;
    }

    /* ── Click a single notification ── */
    const item = e.target.closest('[data-page]');
    if (item) {
      const { notifType, notifId, page } = item.dataset;
      if (notifType === 'alert') Store.update('alerts', notifId, { notifDismissed: true });
      if (notifType === 'email') Store.update('emails', notifId, { read: true });
      renderNotifications();
      updateSidebarBadges();
      panel.classList.remove('open');
      navigate(page);
      return;
    }
  });

  /* ── Search overlay ── */
  document.getElementById('searchClose').addEventListener('click', closeSearch);
  document.getElementById('searchOverlay').addEventListener('click', e => { if (e.target === document.getElementById('searchOverlay')) closeSearch(); });
  document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(e.target.value); });

  /* ── Global keyboard shortcuts ── */
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

    // Escape — close search / modal / notif panel
    if (e.key === 'Escape') {
      closeSearch();
      closeModal();
      document.getElementById('notifPanel').classList.remove('open');
    }

    // ⌘K / Ctrl+K — open search (even from input, to keep it consistent)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const overlay = document.getElementById('searchOverlay');
      if (overlay.classList.contains('open')) closeSearch();
      else openSearch();
      return;
    }

    // ⌘B / Ctrl+B — toggle sidebar
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('collapsed');
        sidebar.classList.toggle('collapsed', !isCollapsed);
        document.querySelector('.main-wrap')?.classList.toggle('sidebar-collapsed', !isCollapsed);
        localStorage.setItem('fg-sidebar-collapsed', isCollapsed ? '0' : '1');
      }
      return;
    }

    // Enter on auth screens
    if (e.key !== 'Enter') return;
    if (document.getElementById('loginScreen').classList.contains('active'))  handleLogin();
    if (document.getElementById('signupScreen').classList.contains('active')) handleSignup();
  });

  // Show keyboard shortcut hints in tooltips
  document.getElementById('searchBtn')?.setAttribute('title', 'Search  (⌘K)');
  document.getElementById('sidebarToggle')?.setAttribute('title', 'Toggle sidebar  (⌘B)');

  /* ══════════════════════════════════════
     MAIN CONTENT EVENT DELEGATION
     ══════════════════════════════════════ */
  document.getElementById('mainContent').addEventListener('click', e => {
    const btn = e.target.closest('[data-action], [data-nav-btn], [data-nav-card]');
    if (!btn) return;
    const { action, id, filter, page, close, key, theme } = btn.dataset;

    /* ── Navigation shortcuts ── */
    if (btn.dataset.navBtn || btn.dataset.navCard) { navigate(btn.dataset.navBtn || btn.dataset.navCard); return; }

    /* ── Filter tabs ── */
    if (action === 'filter-statements')  { document.getElementById('mainContent').innerHTML = renderStatements(filter);     return; }
    if (action === 'filter-repeat')      { document.getElementById('mainContent').innerHTML = renderRepeatAccounts(filter); return; }
    if (action === 'filter-kyc')         { document.getElementById('mainContent').innerHTML = renderKycReviews(filter);     return; }
    if (action === 'filter-alerts')      { document.getElementById('mainContent').innerHTML = renderRiskAlerts(filter);     return; }
    if (action === 'filter-tickets')     { document.getElementById('mainContent').innerHTML = renderTickets(filter);        return; }

    /* ── Row detail ── */
    if (action === 'stmt-detail')   { openStatementDetail(id);  return; }
    if (action === 'alert-detail')  { openAlertDetail(id);      return; }
    if (action === 'client-detail') { openClientDetail(id);     return; }
    if (action === 'ticket-detail') { openTicketDetail(id);     return; }

    /* ── Statement actions ── */
    if (action === 'approve-stmt') {
      const prev = Store.get('statements').find(s => String(s.id) === id)?.status || 'pending';
      Store.update('statements', id, { status: 'approved' });
      Store.addAudit('Approved Statement', `#${id}`, 'Account statement reviewed and approved');
      const rerender = () => { if (close) closeModal(); else document.getElementById('mainContent').innerHTML = renderStatements(); renderNotifications(); updateSidebarBadges(); };
      rerender();
      showToast(`Statement #${id} approved.`, 'success', () => {
        Store.update('statements', id, { status: prev });
        document.getElementById('mainContent').innerHTML = renderStatements();
        renderNotifications(); updateSidebarBadges();
      });
      return;
    }
    if (action === 'reject-stmt') {
      const prev = Store.get('statements').find(s => String(s.id) === id)?.status || 'pending';
      Store.update('statements', id, { status: 'rejected' });
      Store.addAudit('Rejected Statement', `#${id}`, 'Account statement rejected after review');
      if (close) closeModal(); else document.getElementById('mainContent').innerHTML = renderStatements();
      renderNotifications(); updateSidebarBadges();
      showToast(`Statement #${id} rejected.`, 'error', () => {
        Store.update('statements', id, { status: prev });
        document.getElementById('mainContent').innerHTML = renderStatements();
        renderNotifications(); updateSidebarBadges();
      });
      return;
    }

    /* ── Repeat account actions ── */
    if (action === 'approve-repeat') {
      const r = Store.update('repeatAccounts', id, { status: 'approved' });
      Store.addAudit('Approved Repeat Account', r?.client || id, 'New account creation approved');
      if (close) closeModal(); else document.getElementById('mainContent').innerHTML = renderRepeatAccounts();
      renderNotifications(); updateSidebarBadges();
      showToast(`${r?.client || id} approved.`, 'success', () => {
        Store.update('repeatAccounts', id, { status: 'pending' });
        document.getElementById('mainContent').innerHTML = renderRepeatAccounts();
        renderNotifications(); updateSidebarBadges();
      });
      return;
    }
    if (action === 'deny-repeat') {
      const r = Store.update('repeatAccounts', id, { status: 'denied' });
      Store.addAudit('Denied Repeat Account', r?.client || id, 'New account request denied');
      if (close) closeModal(); else document.getElementById('mainContent').innerHTML = renderRepeatAccounts();
      renderNotifications(); updateSidebarBadges();
      showToast(`${r?.client || id} denied.`, 'error', () => {
        Store.update('repeatAccounts', id, { status: 'pending' });
        document.getElementById('mainContent').innerHTML = renderRepeatAccounts();
        renderNotifications(); updateSidebarBadges();
      });
      return;
    }

    /* ── Alert actions ── */
    if (action === 'resolve-alert') {
      const a = Store.update('alerts', id, { status: 'resolved' });
      Store.addAudit('Resolved Alert', a?.title || id, 'Risk alert marked as resolved');
      if (close) closeModal(); else document.getElementById('mainContent').innerHTML = renderRiskAlerts();
      renderNotifications(); updateSidebarBadges();
      showToast('Alert marked as resolved.', 'success', () => {
        Store.update('alerts', id, { status: 'active' });
        document.getElementById('mainContent').innerHTML = renderRiskAlerts();
        renderNotifications(); updateSidebarBadges();
      });
      return;
    }

    /* ── KYC actions ── */
    if (action === 'kyc-renew') {
      const k = Store.update('kyc', id, { status: 'valid', daysLeft: 365 });
      Store.addAudit('Renewed KYC Document', k?.client || id, 'KYC document marked as renewed');
      showToast(`KYC renewed for ${k?.client || id}.`, 'success');
      document.getElementById('mainContent').innerHTML = renderKycReviews(); return;
    }
    if (action === 'kyc-notify') {
      const kycs = Store.get('kyc');
      const k = kycs.find(k => k.id === id);
      Store.addAudit('Notified Client', k?.client || id, 'KYC expiry notification sent to client');
      showToast(`Notification sent to ${k?.client || id}.`, 'info'); return;
    }

    /* ── Ticket actions ── */
    if (action === 'ticket-progress') {
      const t = Store.update('tickets', id, { status: 'in-progress' });
      Store.addAudit('Ticket In Progress', t?.id || id, `Ticket ${id} moved to in-progress`);
      showToast(`Ticket ${id} moved to in progress.`, 'info');
      if (close) closeModal(); else document.getElementById('mainContent').innerHTML = renderTickets();
      return;
    }
    if (action === 'ticket-close') {
      const t = Store.update('tickets', id, { status: 'closed' });
      Store.addAudit('Closed Ticket', t?.id || id, `Ticket ${id} closed`);
      showToast(`Ticket ${id} closed.`, 'success');
      if (close) closeModal(); else document.getElementById('mainContent').innerHTML = renderTickets();
      return;
    }
    if (action === 'new-ticket') { openNewTicketModal(); return; }

    /* ── Forex Accounts CRUD ── */
    if (action === 'fx-add')    { openFxAddModal(); return; }
    if (action === 'fx-cancel') { closeModal(); return; }

    if (action === 'fx-save-new') {
      const fxId            = document.getElementById('fxId')?.value.trim();
      const fxClientName    = document.getElementById('fxClientName')?.value.trim();
      const fxEmail         = document.getElementById('fxEmail')?.value.trim();
      const fxPhone         = document.getElementById('fxPhone')?.value.trim();
      const fxCountry       = document.getElementById('fxCountry')?.value.trim();
      const fxBalance       = document.getElementById('fxBalance')?.value;
      const fxCurrencyPair  = document.getElementById('fxCurrencyPair')?.value.trim();
      const fxStatus        = document.getElementById('fxStatus')?.value;
      const fxKycStatus     = document.getElementById('fxKycStatus')?.value;
      const fxStatementStatus = document.getElementById('fxStatementStatus')?.value;
      const formErr         = document.getElementById('fxFormError');

      if (!fxId || !fxClientName || !fxEmail) {
        formErr.textContent = 'Account ID, Client Name, and Email are required.';
        formErr.classList.add('show'); return;
      }

      (async () => {
        const saveBtn = document.querySelector('[data-action="fx-save-new"]');
        saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
        try {
          const res  = await fetch(`${API_BASE}/forex-accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: fxId, clientName: fxClientName, email: fxEmail,
              phone: fxPhone || null, country: fxCountry || null,
              balance: fxBalance ? parseFloat(fxBalance) : 0,
              currencyPair: fxCurrencyPair || null,
              status: fxStatus, kycStatus: fxKycStatus,
              statementStatus: fxStatementStatus || null,
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            formErr.textContent = json.message || 'Failed to save account.';
            formErr.classList.add('show');
            saveBtn.disabled = false; saveBtn.textContent = 'Save Account';
            return;
          }
          closeModal();
          showToast(`Account ${fxId} created.`, 'success');
          loadForexAccounts();
        } catch {
          formErr.textContent = 'Cannot reach server.';
          formErr.classList.add('show');
          saveBtn.disabled = false; saveBtn.textContent = 'Save Account';
        }
      })();
      return;
    }

    if (action === 'fx-edit') {
      (async () => {
        try {
          const res  = await fetch(`${API_BASE}/forex-accounts`);
          const json = await res.json();
          const account = json.data?.find(a => a.id === id);
          if (!account) { showToast('Account not found.', 'error'); return; }
          openFxEditModal(account);
        } catch {
          showToast('Cannot reach server.', 'error');
        }
      })();
      return;
    }

    if (action === 'fx-save-edit') {
      const editId          = document.getElementById('fxEditId')?.value;
      const fxClientName    = document.getElementById('fxClientName')?.value.trim();
      const fxEmail         = document.getElementById('fxEmail')?.value.trim();
      const fxPhone         = document.getElementById('fxPhone')?.value.trim();
      const fxCountry       = document.getElementById('fxCountry')?.value.trim();
      const fxBalance       = document.getElementById('fxBalance')?.value;
      const fxCurrencyPair  = document.getElementById('fxCurrencyPair')?.value.trim();
      const fxStatus        = document.getElementById('fxStatus')?.value;
      const fxKycStatus     = document.getElementById('fxKycStatus')?.value;
      const fxStatementStatus = document.getElementById('fxStatementStatus')?.value;
      const formErr         = document.getElementById('fxFormError');

      (async () => {
        const saveBtn = document.querySelector('[data-action="fx-save-edit"]');
        saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
        try {
          const res  = await fetch(`${API_BASE}/forex-accounts/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientName: fxClientName, email: fxEmail,
              phone: fxPhone || null, country: fxCountry || null,
              balance: fxBalance ? parseFloat(fxBalance) : 0,
              currencyPair: fxCurrencyPair || null,
              status: fxStatus, kycStatus: fxKycStatus,
              statementStatus: fxStatementStatus || null,
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            formErr.textContent = json.message || 'Failed to update account.';
            formErr.classList.add('show');
            saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
            return;
          }
          closeModal();
          showToast(`Account ${editId} updated.`, 'success');
          loadForexAccounts();
        } catch {
          formErr.textContent = 'Cannot reach server.';
          formErr.classList.add('show');
          saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
        }
      })();
      return;
    }

    if (action === 'fx-delete') {
      const clientName = btn.dataset.name || id;
      if (!confirm(`Delete account ${id} (${clientName})?\n\nThis cannot be undone.`)) return;
      (async () => {
        try {
          const res  = await fetch(`${API_BASE}/forex-accounts/${id}`, { method: 'DELETE' });
          const json = await res.json();
          if (!res.ok) {
            showFxError(json.message || 'Failed to delete account.');
            return;
          }
          clearFxError();
          showToast(`Account ${id} deleted.`, 'success');
          loadForexAccounts();
        } catch {
          showFxError('Cannot reach server.');
        }
      })();
      return;
    }

    /* ── Email actions ── */
    if (action === 'select-email') {
      selectedEmailId = id;
      Store.update('emails', id, { read: true });
      Store.addAudit('Read Email', id, 'Support email opened and marked as read');
      document.getElementById('mainContent').innerHTML = renderSupportEmails();
      renderNotifications(); updateSidebarBadges(); return;
    }
    if (action === 'read-email') {
      Store.update('emails', id, { read: true });
      Store.addAudit('Read Email', id, 'Email marked as read from dashboard');
      e.target.closest('.email-item')?.classList.remove('unread');
      const dot = e.target.closest('.email-item')?.querySelector('.email-dot');
      if (dot) dot.classList.add('invisible');
      renderNotifications(); updateSidebarBadges(); return;
    }
    if (action === 'compose-email') { openComposeModal(); return; }
    if (action === 'reply-email')   { openReplyModal(id); return; }
    if (action === 'forward-email') { showToast('Forward feature coming soon.', 'info'); return; }

    /* ── Preferences actions ── */
    if (action === 'save-profile') {
      const name  = document.getElementById('prefName')?.value.trim();
      const email = document.getElementById('prefEmail')?.value.trim();
      if (name && email) {
        currentUser = { ...currentUser, name, email };
        saveSession(currentUser);
        initDashboard();
        Store.addAudit('Updated Profile', name, 'Agent profile name and email updated');
        showToast('Profile saved.', 'success');
      }
      return;
    }

    /* ── Profile page actions ── */
    if (action === 'profile-save-info') {
      const name  = document.getElementById('profName')?.value.trim();
      const email = document.getElementById('profEmail')?.value.trim();
      if (!name || !email) { showToast('Name and email are required.', 'error'); return; }
      currentUser = { ...currentUser, name, email };
      saveSession(currentUser);
      initDashboard();
      Store.addAudit('Updated Profile', name, 'Profile info updated');
      showToast('Profile saved.', 'success');
      document.getElementById('mainContent').innerHTML = renderProfile();
      return;
    }
    if (action === 'set-avatar-color') {
      const color = btn.dataset.color;
      currentUser = { ...currentUser, avatarType: 'color', avatarValue: color };
      saveProfileData(currentUser.email, { avatarType: 'color', avatarValue: color });
      saveSession(currentUser);
      initDashboard();
      document.getElementById('mainContent').innerHTML = renderProfile();
      showToast('Avatar updated.', 'success');
      return;
    }
    if (action === 'set-avatar-emoji') {
      const emoji = btn.dataset.emoji;
      currentUser = { ...currentUser, avatarType: 'emoji', avatarValue: emoji };
      saveProfileData(currentUser.email, { avatarType: 'emoji', avatarValue: emoji });
      saveSession(currentUser);
      initDashboard();
      document.getElementById('mainContent').innerHTML = renderProfile();
      showToast('Avatar updated.', 'success');
      return;
    }

    /* ── Avatar tab switch ── */
    if (action === 'avatar-tab') {
      activeAvatarTab = btn.dataset.tab;
      document.getElementById('mainContent').innerHTML = renderProfile();
      return;
    }

    /* ── Custom initials ── */
    if (action === 'save-custom-initials') {
      const raw = document.getElementById('customInitials')?.value.trim().toUpperCase().slice(0, 2) || '';
      currentUser = { ...currentUser, avatarCustomInitials: raw || null };
      saveProfileData(currentUser.email, { avatarCustomInitials: raw || null });
      saveSession(currentUser);
      initDashboard();
      document.getElementById('mainContent').innerHTML = renderProfile();
      showToast(raw ? `Initials set to "${raw}".` : 'Using name-derived initials.', 'success');
      return;
    }

    /* ── Photo upload ── */
    if (action === 'photo-upload-zone') {
      document.getElementById('photoInput')?.click();
      return;
    }
    if (action === 'confirm-photo') {
      if (!window._pendingPhoto) return;
      currentUser = { ...currentUser, avatarType: 'photo', avatarValue: window._pendingPhoto };
      saveProfileData(currentUser.email, { avatarType: 'photo', avatarValue: window._pendingPhoto });
      saveSession(currentUser);
      window._pendingPhoto = null;
      initDashboard();
      document.getElementById('mainContent').innerHTML = renderProfile();
      showToast('Profile photo saved.', 'success');
      return;
    }
    if (action === 'cancel-photo') {
      window._pendingPhoto = null;
      document.getElementById('mainContent').innerHTML = renderProfile();
      return;
    }
    if (action === 'remove-photo') {
      currentUser = { ...currentUser, avatarType: 'color', avatarValue: null };
      saveProfileData(currentUser.email, { avatarType: 'color', avatarValue: null });
      saveSession(currentUser);
      initDashboard();
      document.getElementById('mainContent').innerHTML = renderProfile();
      showToast('Profile photo removed.', 'info');
      return;
    }
    if (action === 'profile-change-pw') {
      const current = document.getElementById('pwCurrent')?.value;
      const newPw   = document.getElementById('pwNew')?.value;
      const confirm = document.getElementById('pwConfirm')?.value;
      const msg     = document.getElementById('pwMsg');
      const setMsg  = (t) => { msg.textContent = t; msg.classList.add('show'); };
      if (!current || !newPw || !confirm) { setMsg('Please fill in all fields.'); return; }
      if (newPw.length < 6)               { setMsg('New password must be at least 6 characters.'); return; }
      if (newPw !== confirm)              { setMsg('Passwords do not match.'); return; }
      const accounts = JSON.parse(localStorage.getItem('fg-accounts') || '[]');
      const idx = accounts.findIndex(a => a.email.toLowerCase() === currentUser.email.toLowerCase());
      if (idx === -1 || accounts[idx].password !== current) { setMsg('Current password is incorrect.'); return; }
      accounts[idx].password = newPw;
      localStorage.setItem('fg-accounts', JSON.stringify(accounts));
      msg.classList.remove('show');
      ['pwCurrent','pwNew','pwConfirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      Store.addAudit('Changed Password', currentUser.name, 'Account password updated');
      showToast('Password updated successfully.', 'success');
      return;
    }
    if (action === 'set-theme') {
      applyTheme(theme);
      document.getElementById('mainContent').innerHTML = renderPreferences(); return;
    }
    if (action === 'set-accent-color') {
      const prefs = Store.get('preferences');
      prefs.accentColor = btn.dataset.color;
      Store.set('preferences', prefs);
      applyAccentColor(btn.dataset.color);
      document.getElementById('mainContent').innerHTML = renderPreferences();
      showToast('Accent colour updated.', 'success'); return;
    }
    if (action === 'reset-data') {
      Store.reset();
      showToast('Demo data has been reset.', 'info');
      navigate('dashboard'); return;
    }
  });

  /* ── Inline client search ── */
  document.getElementById('mainContent').addEventListener('input', e => {
    if (e.target.id === 'clientSearch') {
      document.getElementById('mainContent').innerHTML = renderClientProfiles(e.target.value);
    }
  });

  /* ── Modal delegation ── */
  document.getElementById('modalBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;

    if (action === 'send-email') {
      const to   = document.getElementById('composeTo')?.value.trim();
      const subj = document.getElementById('composeSubject')?.value.trim();
      if (!to || !subj) { showToast('Please fill in all fields.', 'error'); return; }
      Store.addAudit('Sent Email', to, `Subject: ${subj}`);
      showToast('Email sent.', 'success');
      closeModal(); return;
    }
    if (action === 'send-reply') {
      const body = document.getElementById('composeBody')?.value.trim();
      if (!body) { showToast('Please write a reply.', 'error'); return; }
      const em = Store.get('emails').find(em => em.id === id);
      Store.addAudit('Replied to Email', em?.from || id, `Subject: RE: ${em?.subject || ''}`);
      showToast('Reply sent.', 'success');
      closeModal(); return;
    }
    if (action === 'create-ticket') {
      const client  = document.getElementById('tkClient')?.value.trim();
      const account = document.getElementById('tkAccount')?.value.trim();
      const subject = document.getElementById('tkSubject')?.value.trim();
      const priority= document.getElementById('tkPriority')?.value;
      const desc    = document.getElementById('tkDesc')?.value.trim();
      if (!client || !subject) { showToast('Please fill in client name and subject.', 'error'); return; }
      const tickets = Store.get('tickets');
      const newId   = 'TK-' + (parseInt(tickets[0]?.id?.split('-')[1] || '1042') + 1);
      tickets.unshift({ id: newId, client, accountId: account || null, subject, priority, status: 'open', created: 'Just now', assignee: 'You', desc: desc || subject });
      Store.set('tickets', tickets);
      Store.addAudit('Created Ticket', newId, `${subject} — ${client}`);
      showToast(`Ticket ${newId} created.`, 'success');
      closeModal();
      navigate('tickets'); return;
    }

    /* ── Forex Accounts modal actions ── */
    if (action === 'fx-cancel') { closeModal(); return; }

    if (action === 'fx-save-new') {
      const fxId              = document.getElementById('fxId')?.value.trim();
      const fxClientName      = document.getElementById('fxClientName')?.value.trim();
      const fxEmail           = document.getElementById('fxEmail')?.value.trim();
      const fxPhone           = document.getElementById('fxPhone')?.value.trim();
      const fxCountry         = document.getElementById('fxCountry')?.value.trim();
      const fxBalance         = document.getElementById('fxBalance')?.value;
      const fxCurrencyPair    = document.getElementById('fxCurrencyPair')?.value.trim();
      const fxStatus          = document.getElementById('fxStatus')?.value;
      const fxKycStatus       = document.getElementById('fxKycStatus')?.value;
      const fxStatementStatus = document.getElementById('fxStatementStatus')?.value;
      const formErr           = document.getElementById('fxFormError');

      if (!fxId || !fxClientName || !fxEmail) {
        formErr.textContent = 'Account ID, Client Name, and Email are required.';
        formErr.classList.add('show'); return;
      }

      (async () => {
        const saveBtn = document.querySelector('[data-action="fx-save-new"]');
        saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
        try {
          const res  = await fetch(`${API_BASE}/forex-accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: fxId, clientName: fxClientName, email: fxEmail,
              phone: fxPhone || null, country: fxCountry || null,
              balance: fxBalance ? parseFloat(fxBalance) : 0,
              currencyPair: fxCurrencyPair || null,
              status: fxStatus, kycStatus: fxKycStatus,
              statementStatus: fxStatementStatus || null,
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            formErr.textContent = json.message || 'Failed to save account.';
            formErr.classList.add('show');
            saveBtn.disabled = false; saveBtn.textContent = 'Save Account';
            return;
          }
          closeModal();
          showToast(`Account ${fxId} created.`, 'success');
          loadForexAccounts();
        } catch {
          formErr.textContent = 'Cannot reach server. Make sure the backend is running.';
          formErr.classList.add('show');
          saveBtn.disabled = false; saveBtn.textContent = 'Save Account';
        }
      })();
      return;
    }

    if (action === 'fx-save-edit') {
      const editId            = document.getElementById('fxEditId')?.value;
      const fxClientName      = document.getElementById('fxClientName')?.value.trim();
      const fxEmail           = document.getElementById('fxEmail')?.value.trim();
      const fxPhone           = document.getElementById('fxPhone')?.value.trim();
      const fxCountry         = document.getElementById('fxCountry')?.value.trim();
      const fxBalance         = document.getElementById('fxBalance')?.value;
      const fxCurrencyPair    = document.getElementById('fxCurrencyPair')?.value.trim();
      const fxStatus          = document.getElementById('fxStatus')?.value;
      const fxKycStatus       = document.getElementById('fxKycStatus')?.value;
      const fxStatementStatus = document.getElementById('fxStatementStatus')?.value;
      const formErr           = document.getElementById('fxFormError');

      (async () => {
        const saveBtn = document.querySelector('[data-action="fx-save-edit"]');
        saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
        try {
          const res  = await fetch(`${API_BASE}/forex-accounts/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientName: fxClientName, email: fxEmail,
              phone: fxPhone || null, country: fxCountry || null,
              balance: fxBalance ? parseFloat(fxBalance) : 0,
              currencyPair: fxCurrencyPair || null,
              status: fxStatus, kycStatus: fxKycStatus,
              statementStatus: fxStatementStatus || null,
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            formErr.textContent = json.message || 'Failed to update account.';
            formErr.classList.add('show');
            saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
            return;
          }
          closeModal();
          showToast(`Account ${editId} updated.`, 'success');
          loadForexAccounts();
        } catch {
          formErr.textContent = 'Cannot reach server. Make sure the backend is running.';
          formErr.classList.add('show');
          saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
        }
      })();
      return;
    }
  });

  /* ── mainContent change events ── */
  document.getElementById('mainContent').addEventListener('change', e => {

    /* Notification toggles */
    if (e.target.dataset.action === 'toggle-notif') {
      const prefs = Store.get('preferences');
      prefs.notifications[e.target.dataset.key] = e.target.checked;
      Store.set('preferences', prefs);
      showToast(`Notification ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
      return;
    }

    /* Photo file input */
    if (e.target.id === 'photoInput' && e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { showToast('File is too large. Max 5 MB.', 'error'); return; }
      compressImage(file, base64 => {
        window._pendingPhoto = base64;
        /* If there's already a photo (Change photo flow), skip straight to confirm */
        if (currentUser.avatarType === 'photo') {
          currentUser = { ...currentUser, avatarType: 'photo', avatarValue: base64 };
          saveProfileData(currentUser.email, { avatarType: 'photo', avatarValue: base64 });
          saveSession(currentUser);
          window._pendingPhoto = null;
          initDashboard();
          document.getElementById('mainContent').innerHTML = renderProfile();
          showToast('Profile photo updated.', 'success');
          return;
        }
        /* New upload — show preview */
        const circle = document.getElementById('photoPreviewCircle');
        const wrap   = document.getElementById('photoPreviewWrap');
        const zone   = document.getElementById('photoUploadZone');
        if (circle) circle.style.cssText = `background:url(${base64}) center/cover no-repeat;width:80px;height:80px;border-radius:50%;flex-shrink:0;border:2px solid var(--border);`;
        if (wrap)   wrap.style.display = 'flex';
        if (zone)   zone.style.display = 'none';
      });
      return;
    }

    /* Custom colour picker */
    if (e.target.id === 'customAvatarColor') {
      const hex = e.target.value;
      currentUser = { ...currentUser, avatarType: 'custom', avatarValue: hex };
      saveProfileData(currentUser.email, { avatarType: 'custom', avatarValue: hex });
      saveSession(currentUser);
      initDashboard();
      document.getElementById('mainContent').innerHTML = renderProfile();
      showToast('Custom colour applied.', 'success');
      return;
    }
  });
});
