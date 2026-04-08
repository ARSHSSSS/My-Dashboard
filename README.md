# ForexGuard — Risk Management Portal

A lightweight, single-page dashboard for Forex risk management agents. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

---

## Preview

| Screen | Description |
|--------|-------------|
| Login / Sign Up | Auth screens with form validation |
| Dashboard | Full risk overview with live widgets |

---

## Project Structure

```
my-dashboard/
├── index.html        # App entry point — all screens and markup
├── css/
│   └── styles.css    # All styles (layout, components, responsive)
├── js/
│   └── app.js        # All logic (auth, dashboard init, chart, events)
└── .gitignore
```

---

## Features

### Authentication
- **Login** — accepts any email + password combination (demo mode); extracts a display name from the email prefix
- **Sign Up** — registers a name, email, and password; immediately transitions to the dashboard
- **Logout** — returns to the login screen and clears the form fields
- **Enter key support** — pressing Enter on either auth screen submits the form

### Dashboard
Once logged in, the dashboard initialises with:
- A personalised greeting (`Good morning/afternoon/evening, [Name]`)
- The current date displayed in the top bar
- User initials auto-generated and shown in the avatar

### Stat Cards
Four summary cards at the top of the dashboard:
| Card | Value |
|------|-------|
| Pending Statements | 14 |
| Repeat Account Requests | 7 (2 urgent) |
| Unread Support Emails | 5 |
| Resolved Today | 9 |

### Account Statements Table
A paginated-style table listing clients with pending or flagged account statements. Each row shows:
- Client name with colour-coded avatar
- Account ID
- Balance
- Status pill (Pending / Flagged / In Review)
- Submission date

### Risk Alerts
A scrollable list of active risk events, each with:
- Severity icon (red / amber / blue)
- Title and short description
- Timestamp

### Repeat Account Requests
A list of clients requesting a second account. Each entry has:
- Client name and previous account history
- **Approve** button — greys out the row and confirms approval
- **Deny** button — greys out the row and marks as denied

### Support Emails
An inbox-style list of support emails. Clicking any email:
- Removes the `unread` highlight
- Hides the blue unread dot

### Quick Actions
A 2×2 grid of shortcut buttons for common agent tasks:
- Review Statement
- Create Free Account (repeat client)
- Reply to Email
- Generate Risk Report PDF

### Activity Bar Chart
A simple 7-day bar chart showing cases resolved per day. Built dynamically in JavaScript — today's bar is highlighted in blue.

---

## How to Run

No installation or build step required.

1. Clone the repo:
   ```bash
   git clone https://github.com/ARSHSSSS/My-Dashboard.git
   cd My-Dashboard
   ```

2. Open `index.html` in your browser:
   ```bash
   open index.html
   ```
   Or just double-click the file in Finder.

---

## Key Functions (`js/app.js`)

| Function | Description |
|----------|-------------|
| `showScreen(name)` | Switches between `login`, `signup`, and `dashboard` screens |
| `handleLogin()` | Validates login form and transitions to the dashboard |
| `handleSignup()` | Validates signup form and transitions to the dashboard |
| `handleLogout()` | Clears session and returns to login |
| `initDashboard()` | Sets user name, avatar, greeting, date, and builds the chart |
| `buildChart()` | Renders the 7-day bar chart dynamically using DOM elements |
| `setActive(el)` | Updates the active state on sidebar navigation links |

---

## Responsive Behaviour

| Breakpoint | Layout change |
|------------|---------------|
| `≤ 1100px` | Stat cards go 2-column; widgets stack vertically; bottom grid goes 2-column |
| `≤ 720px` | Stat cards go 2-column; bottom grid goes 1-column |

---

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, CSS Grid, Flexbox, media queries
- **Vanilla JavaScript** — no libraries or frameworks

---

## Notes for Developers

- **No backend** — this is a fully static front-end demo. Auth is simulated client-side.
- **Adding real auth** — replace `handleLogin()` and `handleSignup()` with API calls and store the session token.
- **Adding real data** — replace the hardcoded table rows and alert items with `fetch()` calls to your API and render them dynamically.
- **Chart library** — the bar chart is a lightweight custom implementation. Swap `buildChart()` with Chart.js or similar if you need more chart types.
