/* ── State ─────────────────────────────────────── */
let currentUser = { name: 'Alex Johnson', email: '' };

/* ── Screen management ─────────────────────────── */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const map = { login: 'loginScreen', signup: 'signupScreen', dashboard: 'dashboardScreen' };
  document.getElementById(map[name]).classList.add('active');
}

/* ── Auth handlers ─────────────────────────────── */
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const err   = document.getElementById('loginError');

  if (!email || !pass) {
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');

  // Extract name from email prefix if not set via signup
  const namePart = email.split('@')[0].replace(/[._]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  currentUser = { name: namePart, email };
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
  initDashboard();
  showScreen('dashboard');
}

function handleLogout() {
  showScreen('login');
  document.getElementById('loginEmail').value    = '';
  document.getElementById('loginPassword').value = '';
}

/* ── Dashboard init ────────────────────────────── */
function initDashboard() {
  // Name & avatar
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('userName').textContent   = currentUser.name;
  document.getElementById('greetName').textContent  = currentUser.name.split(' ')[0];

  // Greeting
  const h = new Date().getHours();
  document.getElementById('greeting').textContent =
    h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';

  // Date label
  document.getElementById('dateLabel').textContent =
    new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Chart
  buildChart();
}

/* ── Bar chart ─────────────────────────────────── */
function buildChart() {
  const data = [5, 8, 6, 11, 9, 7, 9];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0
  const max = Math.max(...data);
  const container = document.getElementById('chartBars');
  container.innerHTML = '';

  data.forEach((v, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'bar' + (i === todayIdx ? ' highlight' : '');
    bar.style.height = Math.round((v / max) * 100) + '%';
    bar.title = `${days[i]}: ${v} cases`;

    const lbl = document.createElement('div');
    lbl.className = 'bar-label';
    lbl.textContent = days[i];

    wrap.appendChild(bar);
    wrap.appendChild(lbl);
    container.appendChild(wrap);
  });
}

/* ── Nav active state ──────────────────────────── */
function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

/* ── Enter key on login / signup ───────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('loginScreen').classList.contains('active'))  handleLogin();
  if (document.getElementById('signupScreen').classList.contains('active')) handleSignup();
});

/* ── Approve / deny buttons (demo feedback) ───── */
document.addEventListener('click', e => {
  if (e.target.classList.contains('btn-approve')) {
    const item = e.target.closest('.req-item');
    item.style.opacity = '.4';
    item.style.pointerEvents = 'none';
    item.querySelector('.req-detail').textContent = '✅ Approved — account creation in progress';
  }

  if (e.target.classList.contains('btn-deny')) {
    const item = e.target.closest('.req-item');
    item.style.opacity = '.4';
    item.style.pointerEvents = 'none';
    item.querySelector('.req-detail').textContent = '❌ Denied';
  }

  // Mark email read on click
  if (e.target.closest('.email-item')) {
    e.target.closest('.email-item').classList.remove('unread');
    const dot = e.target.closest('.email-item').querySelector('.email-dot');
    if (dot) dot.classList.add('invisible');
  }
});
