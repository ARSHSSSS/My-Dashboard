/* ═══════════════════════════════════════════
   ForexGuard — data.js
   Seed data + localStorage Store
   ═══════════════════════════════════════════ */

const SEED = {
  statements: [
    { id: 'FX-00412', client: 'Marcus Klein',  initials: 'MK', color: 'a', balance: 24580,  status: 'pending',   submitted: 'Today, 09:14' },
    { id: 'FX-00387', client: 'Sofia Lopes',   initials: 'SL', color: 'b', balance: 8200,   status: 'flagged',   submitted: 'Today, 08:52' },
    { id: 'FX-00351', client: 'Tariq Nasir',   initials: 'TN', color: 'c', balance: 61000,  status: 'pending',   submitted: 'Yesterday' },
    { id: 'FX-00290', client: 'Anna Weber',    initials: 'AW', color: 'd', balance: 3450,   status: 'in-review', submitted: 'Yesterday' },
    { id: 'FX-00275', client: 'James Park',    initials: 'JP', color: 'e', balance: 112300, status: 'pending',   submitted: '2 days ago' },
    { id: 'FX-00260', client: 'Elena Rossi',   initials: 'ER', color: 'a', balance: 18750,  status: 'pending',   submitted: '2 days ago' },
    { id: 'FX-00244', client: 'Omar Hassan',   initials: 'OH', color: 'b', balance: 45200,  status: 'approved',  submitted: '3 days ago' },
    { id: 'FX-00231', client: 'Yuki Tanaka',   initials: 'YT', color: 'c', balance: 9800,   status: 'flagged',   submitted: '3 days ago' },
    { id: 'FX-00218', client: 'Liam Carter',   initials: 'LC', color: 'd', balance: 33100,  status: 'approved',  submitted: '4 days ago' },
    { id: 'FX-00205', client: 'Amara Diallo',  initials: 'AD', color: 'e', balance: 76400,  status: 'pending',   submitted: '4 days ago' },
    { id: 'FX-00192', client: 'Nina Patel',    initials: 'NP', color: 'a', balance: 5100,   status: 'rejected',  submitted: '5 days ago' },
    { id: 'FX-00178', client: 'Kai Andersen',  initials: 'KA', color: 'b', balance: 29800,  status: 'approved',  submitted: '5 days ago' },
  ],

  repeatAccounts: [
    { id: 'RA-001', client: 'Daniel Müller',   initials: 'DM', color: 'a', prevAccount: 'FX-00188', closedDate: '14 Jan', reason: 'no-bonus policy',  status: 'pending' },
    { id: 'RA-002', client: 'Priya Sharma',    initials: 'PS', color: 'b', prevAccount: 'FX-00241', closedDate: '3 Feb',  reason: 'account reset',    status: 'pending' },
    { id: 'RA-003', client: 'Kenji Watanabe',  initials: 'KW', color: 'c', prevAccount: 'FX-00302', closedDate: '18 Feb', reason: 'duplicate claim',  status: 'pending' },
    { id: 'RA-004', client: 'Layla Hassan',    initials: 'LH', color: 'd', prevAccount: 'FX-00355', closedDate: '1 Mar',  reason: 'promo expired',    status: 'pending' },
    { id: 'RA-005', client: 'Carlos Rivera',   initials: 'CR', color: 'e', prevAccount: 'FX-00398', closedDate: '10 Mar', reason: 'policy breach',    status: 'pending' },
    { id: 'RA-006', client: 'Mei Lin',         initials: 'ML', color: 'a', prevAccount: 'FX-00421', closedDate: '22 Mar', reason: 'account reset',    status: 'pending' },
    { id: 'RA-007', client: 'Ivan Petrov',     initials: 'IP', color: 'b', prevAccount: 'FX-00445', closedDate: '1 Apr',  reason: 'duplicate claim',  status: 'approved' },
  ],

  clients: [
    { id: 'FX-00412', name: 'Marcus Klein',  initials: 'MK', color: 'a', email: 'marcus.klein@email.com',  phone: '+44 7911 123456',    balance: 24580,  status: 'active',    kyc: 'valid',    joined: '12 Jan 2025', country: 'Germany',     currency: 'EUR/USD' },
    { id: 'FX-00387', name: 'Sofia Lopes',   initials: 'SL', color: 'b', email: 'sofia.lopes@email.com',   phone: '+351 912 345678',    balance: 8200,   status: 'flagged',   kyc: 'expiring', joined: '3 Mar 2025',  country: 'Portugal',    currency: 'GBP/USD' },
    { id: 'FX-00351', name: 'Tariq Nasir',   initials: 'TN', color: 'c', email: 'tariq.nasir@email.com',   phone: '+92 300 1234567',    balance: 61000,  status: 'active',    kyc: 'valid',    joined: '5 May 2024',  country: 'Pakistan',    currency: 'USD/JPY' },
    { id: 'FX-00290', name: 'Anna Weber',    initials: 'AW', color: 'd', email: 'anna.weber@email.com',    phone: '+49 151 23456789',   balance: 3450,   status: 'suspended', kyc: 'expired',  joined: '18 Aug 2024', country: 'Germany',     currency: 'EUR/GBP' },
    { id: 'FX-00275', name: 'James Park',    initials: 'JP', color: 'e', email: 'james.park@email.com',    phone: '+82 10 1234 5678',   balance: 112300, status: 'active',    kyc: 'valid',    joined: '2 Feb 2024',  country: 'South Korea', currency: 'USD/KRW' },
    { id: 'FX-00260', name: 'Elena Rossi',   initials: 'ER', color: 'a', email: 'elena.rossi@email.com',   phone: '+39 333 1234567',    balance: 18750,  status: 'active',    kyc: 'valid',    joined: '20 Nov 2024', country: 'Italy',       currency: 'EUR/USD' },
    { id: 'FX-00244', name: 'Omar Hassan',   initials: 'OH', color: 'b', email: 'omar.hassan@email.com',   phone: '+971 50 1234567',    balance: 45200,  status: 'active',    kyc: 'valid',    joined: '8 Sep 2024',  country: 'UAE',         currency: 'USD/AED' },
    { id: 'FX-00231', name: 'Yuki Tanaka',   initials: 'YT', color: 'c', email: 'yuki.tanaka@email.com',   phone: '+81 90 1234 5678',   balance: 9800,   status: 'suspended', kyc: 'expired',  joined: '15 Jun 2024', country: 'Japan',       currency: 'USD/JPY' },
    { id: 'FX-00218', name: 'Liam Carter',   initials: 'LC', color: 'd', email: 'liam.carter@email.com',   phone: '+1 555 123 4567',    balance: 33100,  status: 'active',    kyc: 'valid',    joined: '30 Apr 2024', country: 'USA',         currency: 'EUR/USD' },
    { id: 'FX-00205', name: 'Amara Diallo',  initials: 'AD', color: 'e', email: 'amara.diallo@email.com',  phone: '+221 77 123 4567',   balance: 76400,  status: 'active',    kyc: 'expiring', joined: '11 Jan 2024', country: 'Senegal',     currency: 'EUR/USD' },
  ],

  kyc: [
    { id: 'KYC-001', client: 'Anna Weber',   initials: 'AW', color: 'd', accountId: 'FX-00290', docType: 'National ID', expiry: '30 Mar 2026', status: 'expired',  daysLeft: -15 },
    { id: 'KYC-002', client: 'Yuki Tanaka',  initials: 'YT', color: 'c', accountId: 'FX-00231', docType: 'Passport',    expiry: '1 Apr 2026',  status: 'expired',  daysLeft: -13 },
    { id: 'KYC-003', client: 'Sofia Lopes',  initials: 'SL', color: 'b', accountId: 'FX-00387', docType: 'Passport',    expiry: '25 Apr 2026', status: 'expiring', daysLeft: 11  },
    { id: 'KYC-004', client: 'Amara Diallo', initials: 'AD', color: 'e', accountId: 'FX-00205', docType: 'Passport',    expiry: '10 May 2026', status: 'expiring', daysLeft: 26  },
    { id: 'KYC-005', client: 'Marcus Klein', initials: 'MK', color: 'a', accountId: 'FX-00412', docType: 'Passport',    expiry: '15 Jan 2027', status: 'valid',    daysLeft: 276 },
    { id: 'KYC-006', client: 'Tariq Nasir',  initials: 'TN', color: 'c', accountId: 'FX-00351', docType: 'National ID', expiry: '20 Jun 2027', status: 'valid',    daysLeft: 432 },
    { id: 'KYC-007', client: 'James Park',   initials: 'JP', color: 'e', accountId: 'FX-00275', docType: 'Passport',    expiry: '28 Feb 2028', status: 'valid',    daysLeft: 685 },
  ],

  alerts: [
    { id: 'ALT-001', severity: 'red',   icon: '🚨', title: 'Abnormal withdrawal pattern',       desc: '3 large withdrawals in 24h exceed threshold',         account: 'FX-00387', time: '09:31', status: 'active',   detail: 'Client has made 3 withdrawals totalling $45,000 in the past 24 hours, exceeding the $30,000 daily threshold. Pattern matches known indicators. Recommend account freeze pending investigation.' },
    { id: 'ALT-002', severity: 'red',   icon: '🔴', title: 'Margin call risk',                  desc: 'Equity ratio dropped below 120% on EUR/USD',           account: 'FX-00412', time: '08:47', status: 'active',   detail: 'Client\'s EUR/USD position has an equity ratio of 108%, below the 120% margin call threshold. Exposure: $24,580. Automatic liquidation will trigger if ratio drops to 100%.' },
    { id: 'ALT-003', severity: 'amber', icon: '⚡', title: 'Repeat account detected',           desc: 'Matches existing client by device fingerprint',        account: 'FX-00501', time: '08:12', status: 'active',   detail: 'New account registration matches device fingerprint of existing client FX-00188 (Daniel Müller, closed Jan 14). Same IP address, browser fingerprint, and geo-location detected.' },
    { id: 'ALT-004', severity: 'amber', icon: '📌', title: 'KYC document expiring',             desc: 'Passport expires in 11 days; renewal required',        account: 'FX-00387', time: 'Yesterday', status: 'active',   detail: 'Client Sofia Lopes\' passport expires on 25 April 2026. Regulatory requirements mandate valid documentation. Account will be suspended if not renewed before expiry.' },
    { id: 'ALT-005', severity: 'blue',  icon: 'ℹ️', title: 'New regulatory bulletin (FCA 2026/04)', desc: 'Updated leverage limits effective May 1',         account: null,       time: 'Yesterday', status: 'active',   detail: 'FCA bulletin FCA/2026/04 introduces updated leverage limits for retail clients effective 1 May 2026. Maximum leverage reduced from 1:30 to 1:20 on major pairs. All affected accounts must be updated.' },
    { id: 'ALT-006', severity: 'green', icon: '✅', title: 'Margin call resolved',              desc: 'Client deposited funds, equity ratio now 145%',        account: 'FX-00275', time: '2 days ago', status: 'resolved', detail: 'Client James Park deposited $15,000, bringing equity ratio to 145%. Risk resolved. No further action required.' },
  ],

  emails: [
    { id: 'EM-001', from: 'Marcus Klein',     accountId: 'FX-00412', subject: 'Why is my withdrawal still pending?',       body: 'Hello,\n\nI submitted a withdrawal request 3 days ago for $5,000 and it is still showing as pending. Can you please advise on the timeline and expected resolution?\n\nBest regards,\nMarcus Klein', time: '9:14 AM',    read: false },
    { id: 'EM-002', from: 'Sofia Lopes',      accountId: 'FX-00387', subject: 'Account flagged — please clarify',           body: 'Dear Support,\n\nI received a notification that my account has been flagged. I have not done anything outside of normal trading activity. Could you please clarify the reason and advise what steps I need to take?\n\nThank you,\nSofia Lopes', time: '8:52 AM',    read: false },
    { id: 'EM-003', from: 'Support Team',     accountId: null,        subject: 'RE: FCA bulletin — action required by May 1', body: 'Team,\n\nPlease review FCA bulletin 2026/04 regarding updated leverage limits effective 1 May 2026. All agents must review affected client accounts and update leverage settings accordingly before the deadline.\n\nCompliance Team', time: '8:30 AM',    read: false },
    { id: 'EM-004', from: 'Daniel Müller',    accountId: null,        subject: 'Repeat account request follow-up',           body: 'Hi,\n\nI submitted a new account request last week and have not heard back. My previous account was #FX-00188. I understand the process but would appreciate an update on my application status.\n\nDaniel', time: 'Yesterday',  read: false },
    { id: 'EM-005', from: 'Compliance Dept.', accountId: null,        subject: 'Q1 risk audit report — please review',       body: 'Dear Risk Management Team,\n\nPlease find the Q1 2026 risk audit report for your review. Key findings are summarised on page 3. Action items are due by 30 April 2026. Please confirm receipt.\n\nCompliance Department', time: '2 days ago', read: true  },
    { id: 'EM-006', from: 'James Park',       accountId: 'FX-00275', subject: 'Account deposit confirmation',                body: 'Hi team,\n\nI have just made a bank transfer of $15,000 to resolve the margin call on my account. Please confirm once the funds have been processed and the alert has been cleared.\n\nThanks,\nJames Park', time: '2 days ago', read: true  },
  ],

  tickets: [
    { id: 'TK-1042', client: 'Marcus Klein',  accountId: 'FX-00412', subject: 'Withdrawal delay — 3 days pending',     priority: 'high',   status: 'open',        created: 'Today',      assignee: 'You',        desc: 'Client reports withdrawal pending for 3 days. Needs investigation and resolution within 24 hours.' },
    { id: 'TK-1041', client: 'Sofia Lopes',   accountId: 'FX-00387', subject: 'Account flagged — client dispute',      priority: 'high',   status: 'in-progress', created: 'Today',      assignee: 'You',        desc: 'Client disputes account flag. Requires review of recent transactions before unflagging.' },
    { id: 'TK-1040', client: 'Anna Weber',    accountId: 'FX-00290', subject: 'KYC document renewal required',         priority: 'medium', status: 'open',        created: 'Yesterday',  assignee: 'Unassigned', desc: 'KYC document expired. Client has been notified but has not yet submitted renewal documentation.' },
    { id: 'TK-1039', client: 'Yuki Tanaka',   accountId: 'FX-00231', subject: 'Account suspension appeal',             priority: 'medium', status: 'in-progress', created: 'Yesterday',  assignee: 'You',        desc: 'Client is appealing account suspension. Documents under review by compliance team.' },
    { id: 'TK-1038', client: 'Tariq Nasir',   accountId: 'FX-00351', subject: 'Leverage limit update query',           priority: 'low',    status: 'open',        created: '2 days ago', assignee: 'Unassigned', desc: 'Client enquiring about FCA leverage limit changes effective May 1. Requires agent response.' },
    { id: 'TK-1037', client: 'James Park',    accountId: 'FX-00275', subject: 'Margin call resolved — confirmation',   priority: 'low',    status: 'closed',      created: '2 days ago', assignee: 'You',        desc: 'Client deposited funds to clear margin call. Confirmed resolved. No further action required.' },
    { id: 'TK-1036', client: 'Omar Hassan',   accountId: 'FX-00244', subject: 'Account statement approved',            priority: 'low',    status: 'closed',      created: '3 days ago', assignee: 'You',        desc: 'Account statement reviewed and approved. No issues found.' },
  ],

  audit: [],

  preferences: {
    notifications: {
      riskAlerts:     true,
      kycExpiry:      true,
      repeatAccounts: true,
      newEmails:      true,
      systemUpdates:  false,
    }
  }
};

/* ── Store ──────────────────────────────────── */
const Store = {
  _p: 'fg-',

  get(key) {
    const raw = localStorage.getItem(this._p + key);
    if (raw !== null) return JSON.parse(raw);
    const seed = SEED[key];
    if (seed !== undefined) { this.set(key, seed); return JSON.parse(JSON.stringify(seed)); }
    return null;
  },

  set(key, data) {
    localStorage.setItem(this._p + key, JSON.stringify(data));
  },

  update(key, id, changes) {
    const items = this.get(key);
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...changes };
      this.set(key, items);
      return items[idx];
    }
    return null;
  },

  addAudit(action, target, detail = '') {
    const audit = this.get('audit') || [];
    const user = JSON.parse(localStorage.getItem('fg-user') || '{"name":"Agent"}');
    const now = new Date();
    audit.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) +
                 ', ' + now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      user: user.name,
      action,
      target,
      detail
    });
    this.set('audit', audit.slice(0, 150));
  },

  reset() {
    Object.keys(SEED).forEach(k => localStorage.removeItem(this._p + k));
  }
};
