# ForexGuard — Risk Management Portal

A risk management dashboard for Forex brokerage agents. The frontend is a vanilla HTML/CSS/JS SPA; the backend is a Node.js + Express REST API backed by PostgreSQL via Prisma ORM.

**Live demo (frontend only):** https://arshssss.github.io/My-Dashboard/

---

## What it does

ForexGuard gives compliance and risk agents a single command centre to:

- Review and approve/reject **account statements**
- Monitor **risk alerts** (margin calls, abnormal withdrawals)
- Track **KYC document** expiry and renewals
- Manage **repeat account** requests
- Handle **support emails** and **tickets**
- Manage **client trading accounts** (Forex Accounts CRUD)
- View an **audit log** of every agent action

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend markup | HTML5 |
| Frontend styles | CSS3 — custom properties, Grid, Flexbox |
| Frontend logic | Vanilla JavaScript (ES2020) — no frameworks |
| Charts | Chart.js 4.4.3 (CDN) |
| Local data | `localStorage` (seed data for demo) |
| Backend runtime | Node.js |
| Backend framework | Express |
| ORM & migrations | Prisma |
| Database | PostgreSQL |
| Password hashing | bcrypt |
| Hosting (frontend) | GitHub Pages |

---

## Project Structure

```
My-Dashboard/
├── frontend/
│   ├── index.html          # Landing / marketing page
│   ├── app.html            # SPA shell — all screens (login, signup, dashboard)
│   ├── css/
│   │   ├── styles.css      # Dashboard styles
│   │   └── landing.css     # Landing page styles
│   ├── js/
│   │   ├── app.js          # SPA logic (router, pages, auth, events)
│   │   ├── data.js         # Seed data + localStorage Store wrapper
│   │   └── i18n.js         # English / Persian translations
│   ├── icons/
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker (offline cache)
├── backend/
│   ├── index.js            # Express app entry point
│   ├── .env                # Local credentials (gitignored — never committed)
│   ├── .env.example        # Placeholder env vars for teammates
│   ├── .gitignore
│   ├── package.json
│   ├── controllers/
│   │   ├── authController.js         # Register / Login logic
│   │   ├── forexAccountController.js # Forex Accounts CRUD
│   │   └── userController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── forexAccounts.js
│   │   └── users.js
│   ├── models/             # Reserved for future model helpers
│   └── prisma/
│       ├── schema.prisma   # Data models (User, ForexAccount)
│       └── migrations/     # SQL migration history (committed)
├── .gitignore
└── README.md
```

---

## How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [PostgreSQL](https://www.postgresql.org/) running locally

### 1. Clone the repo

```bash
git clone https://github.com/ARSHSSSS/My-Dashboard.git
cd My-Dashboard
```

### 2. Set up the backend

```bash
cd backend

# Copy the example env file and fill in your credentials
cp .env.example .env
# Edit .env — replace USER and PASSWORD with your PostgreSQL credentials
```

Install dependencies and run migrations:

```bash
npm install
npx prisma migrate dev
```

Start the server:

```bash
npm run dev      # development (nodemon — auto-restarts on save)
# or
npm start        # production
```

The API will be available at `http://localhost:3001`.

### 3. Open the frontend

No build step required — open `frontend/index.html` directly in your browser:

```bash
open frontend/index.html        # macOS
# or just double-click index.html inside the frontend/ folder
```

The frontend expects the backend at `http://localhost:3001/api` (configured via `API_BASE` in `frontend/js/app.js`).

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/dashboard_db"
PORT=3001
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port the Express server listens on (default: 3001) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new agent (name, email, password, role) |
| `POST` | `/api/auth/login` | Log in — returns name and role |
| `GET` | `/api/forex-accounts` | List all Forex accounts |
| `POST` | `/api/forex-accounts` | Create a new account |
| `PUT` | `/api/forex-accounts/:id` | Update an account |
| `DELETE` | `/api/forex-accounts/:id` | Delete an account |

All endpoints return `{ success, data, message }`.

---

## Database Models

### `User`
Agent accounts (staff who log in to the portal).

| Column | Type | Notes |
|--------|------|-------|
| id | Int (PK) | Auto-increment |
| name | String | Required |
| email | String | Unique, required |
| passwordHash | String? | bcrypt hash |
| role | String? | `risk`, `support`, `sales`, `finance` |
| createdAt | DateTime | Auto |

### `ForexAccount`
Client trading accounts managed by agents.

| Column | Type | Notes |
|--------|------|-------|
| id | String (PK) | e.g. `FX-00412` |
| clientName | String | Required |
| email | String | Unique, required |
| phone | String? | |
| country | String? | |
| balance | Float | Default 0 |
| currencyPair | String? | e.g. `EUR/USD` |
| status | String | `active`, `flagged`, `suspended` |
| kycStatus | String | `valid`, `expiring`, `expired` |
| kycDocType | String? | |
| kycExpiry | DateTime? | |
| statementStatus | String? | `pending`, `in-review`, `approved`, `flagged`, `rejected` |
| statementSubmittedAt | DateTime? | |
| repeatOf | String? | Previous account ID if repeat |
| repeatReason | String? | |
| assignedAgentId | Int? | FK → User |
| joinedAt | DateTime | |
| createdAt | DateTime | Auto |

---

## Demo Account

A built-in demo account is available on the login screen (no backend required):

- **Email:** `demo@forexguard.com`
- **Password:** `Demo@2026`

The demo account uses `localStorage` only and does not call the API.

---

## Notes for Developers

- **API base URL** — The frontend reads from `API_BASE` in `js/app.js` (`http://localhost:3001/api`). Change this constant if your backend runs on a different port or host.
- **Migrations** — Prisma migration `.sql` files are committed to git so any teammate can run `npx prisma migrate dev` to reproduce the exact database schema.
- **`.env` is gitignored** — Never commit real credentials. Use `.env.example` to communicate which variables are needed.
- **Adding pages** — Add an entry to `PAGE_MAP` in `js/app.js` with a `render*()` function; the router picks it up automatically.
- **Extending the API** — Add a controller in `backend/controllers/`, a route file in `backend/routes/`, and register it in `backend/server.js`.
