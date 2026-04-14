# ForexGuard — Risk Management Portal

A fully functional, client-side single-page application (SPA) for Forex risk management agents. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no backend required.

**Live demo:** https://arshssss.github.io/My-Dashboard/

---

## Screens

| Screen | URL |
|--------|-----|
| Home (landing page) | `/` or `/index.html` |
| Login / Sign Up | `/app.html` |
| Dashboard (all 12 pages) | `/app.html` (after login) |

**Demo credentials:** `demo@forexguard.com` / `Demo@2026`

---

## Project Structure

```
My-Dashboard/
├── index.html          # Home — marketing landing page (GitHub Pages default)
├── app.html            # SPA shell — all screens, sidebar, topbar, modal
├── css/
│   ├── styles.css      # Dashboard styles (layout, components, theming)
│   └── landing.css     # Landing page styles
├── js/
│   ├── data.js         # Seed data + Store class (localStorage wrapper)
│   └── app.js          # All SPA logic (router, pages, auth, events)
├── LICENSE
└── README.md
```

---

## Features

### Authentication & Session
- **Login** — validates credentials against a hardcoded demo account or any registered account stored in `localStorage`
- **Sign Up** — registers name, email, and password; duplicate-email check; minimum 6-character password
- **30-minute session** — after logging in, refreshing the page restores the session automatically; any navigation resets the idle timer
- **Demo account hint** — credentials displayed on the login screen for easy onboarding
- **Enter key support** — submits whichever auth form is active

### User Profile & Avatar
- **My Profile page** — dedicated page showing a hero card with login count, total actions, member-since date, and last-active date
- **Edit info** — update display name and email directly from the profile page
- **Avatar picker** — choose from 8 colour gradient presets (Indigo, Blue, Violet, Emerald, Rose, Amber, Cyan, Pink) or 12 emoji options (🦁 🐯 🦊 🐺 🦅 🐉 🦄 🌊 ⚡ 🔥 🎯 🛡️)
- **Auto-assigned colour** — on first login, a unique gradient is assigned based on a hash of the user's name
- **Avatar colour theme** — the active navigation highlight colour matches the user's chosen avatar colour across the whole sidebar
- **Change password** — validates old password before updating; disabled for the demo account
- **Profile dropdown** — clicking the topbar avatar opens a popover menu (My Profile, Preferences, Sign Out)

### Navigation
- **Client-side router** — `navigate(page)` renders pages into `#mainContent` without any page reload
- **12 pages:** Dashboard, Account Statements, Repeat Accounts, Client Profiles, KYC Reviews, Risk Alerts, Exposure Reports, Audit Logs, Support Emails, Tickets, Preferences, My Profile
- **Live sidebar badges** — counts update immediately whenever a case is approved, resolved, or closed
- **Keyboard shortcut** — `Escape` closes any open modal, search overlay, or panel

### Dashboard
- Personalised greeting (`Good morning/afternoon/evening, [Name]`)
- 4 stat cards with live counts from the data store
- 7-day activity bar chart (Chart.js) with dark/light theme support
- Quick-action buttons for common agent tasks
- Recent statements table and inbox preview widgets

### Account Statements
- Full table with filter tabs: All / Pending / Flagged / Approved
- Click any row to open a detail modal
- Approve or Reject directly from the modal or inline

### Repeat Accounts
- Cards with filter tabs: All / Pending / Approved / Denied
- Approve / Deny actions with instant Store update and audit log entry

### Client Profiles
- Live search — filters the table as you type
- Click any row for a full detail modal (email, phone, balance, KYC status, currency pair, join date)

### KYC Reviews
- Colour-coded status pills: Valid / Expiring / Expired
- Renew and Notify actions per document

### Risk Alerts
- Filter tabs: All / Active / Resolved
- Full-detail modal with severity header and Resolve action
- Resolved alerts disappear from the notification bell (but remain visible on this page)

### Exposure Reports
- Line chart (open exposure over time) and doughnut chart (currency pair breakdown) via Chart.js
- Summary table of top currency exposures

### Audit Logs
- Timeline view of every agent action (approvals, logins, password changes, etc.)
- Last 150 entries kept in `localStorage`

### Support Emails
- Split-panel layout: email list on the left, reading pane on the right
- Compose and Reply modals
- Unread count updates the sidebar badge and notification bell in real time

### Tickets
- Filter tabs: All / Open / In Progress / Closed
- Detail modal with status transitions (Open → In Progress → Closed)
- Create New Ticket modal

### Notifications (Bell)
- Shows up to 5 active alerts + 3 unread emails
- Clicking an item dismisses it from the panel and navigates to the relevant page
- **Clear All** marks all active alerts as panel-dismissed and all emails as read instantly
- Bell dot disappears when there are no pending notifications

### Preferences
- Theme switcher (dark / light) with toggle button in the topbar
- Per-key notification toggles (Risk Alerts, KYC Expiry, Repeat Accounts, New Emails, System Updates)
- Reset demo data — restores all Store data to its original seed state

### Search
- Global search overlay (`Ctrl/Cmd + K` or click 🔍)
- Filters client profiles by name, email, or country

---

## Data Layer (`js/data.js`)

All data is stored in `localStorage` under `fg-*` keys. On first load, seed data is written automatically.

```
fg-statements       — 12 account statements
fg-repeatAccounts   — 7 repeat account requests
fg-clients          — 10 client profiles
fg-kyc              — 7 KYC records
fg-alerts           — 6 risk alerts
fg-emails           — 6 support emails
fg-tickets          — 7 support tickets
fg-audit            — agent action log (last 150 entries)
fg-preferences      — notification toggles + theme
fg-accounts         — registered user credentials
fg-profile-{email}  — per-user avatar, login count, join date
fg-session          — active session with 30-min expiry timestamp
```

### Store API

| Method | Description |
|--------|-------------|
| `Store.get(key)` | Read array from localStorage (seeds on first access) |
| `Store.set(key, data)` | Write array to localStorage |
| `Store.update(key, id, changes)` | Find record by `id`, merge changes, save |
| `Store.addAudit(action, target, detail)` | Prepend to audit log, keep last 150 |
| `Store.reset()` | Remove all `fg-*` keys (resets to seed data on next read) |

---

## Key Functions (`js/app.js`)

| Function | Description |
|----------|-------------|
| `navigate(page)` | Client-side router — renders a page and updates the sidebar |
| `showScreen(name)` | Switches between `login`, `signup`, and `dashboard` screens |
| `handleLogin()` | Validates credentials, loads profile data, saves session |
| `handleSignup()` | Registers a new account, saves credentials and profile |
| `handleLogout()` | Clears session and returns to the login screen |
| `initDashboard()` | Updates topbar avatar, name, colour theme, badges |
| `updateSidebarBadges()` | Recomputes all sidebar badge counts from the Store |
| `renderNotifications()` | Rebuilds the bell panel from live Store data |
| `applyUserColor(user)` | Injects a `<style>` tag to theme the nav with the user's avatar colour |
| `saveSession(user)` | Writes session + 30-min expiry to localStorage |
| `loadSession()` | Returns the saved user if the session is still valid |
| `renderProfile()` | Renders the My Profile page (hero card, avatar picker, password change) |
| `renderDashboard()` | Renders the main dashboard with charts and widgets |
| `openModal(title, html)` | Opens the shared modal with given content |
| `showToast(message, type)` | Shows a transient toast notification (success / error / info) |
| `applyTheme(theme)` | Applies dark/light theme and updates chart colours |

---

## How to Run Locally

No installation or build step required.

```bash
git clone https://github.com/ARSHSSSS/My-Dashboard.git
cd My-Dashboard
open index.html   # opens the landing page
```

Or just double-click `index.html` in Finder.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styles | CSS3 — custom properties, Grid, Flexbox, `@keyframes` |
| Logic | Vanilla JavaScript (ES2020) — no frameworks |
| Charts | [Chart.js 4.4.3](https://www.chartjs.org/) via CDN |
| Storage | `localStorage` — all data persisted client-side |
| Hosting | GitHub Pages |

---

## Notes for Developers

- **No backend** — auth, data, and sessions are entirely client-side. Do not use in production without a real backend.
- **Adding real auth** — replace `handleLogin()` / `handleSignup()` with API calls and store a JWT or session token server-side.
- **Adding real data** — replace `Store.get()` seed reads with `fetch()` calls to your REST or GraphQL API.
- **Extending pages** — add an entry to `PAGE_MAP` in `app.js` and a matching `render*()` function; the router picks it up automatically.
- **Avatar persistence** — avatar preferences are stored under `fg-profile-{email}` so they survive re-login and are independent of credentials.
