# SaaSboard — App Spec & Code Walkthrough

## What this app is

A revenue tracking dashboard for an independent software developer. You log clients, and every payment you receive from them — whether it's a one-off service invoice, a product license, or a monthly subscription — gets recorded as a transaction. The dashboard then aggregates those transactions into charts, KPIs, and reports so you always know where your money is coming from.

Inspired by Stripe's dashboard but stripped down to just what a solo dev actually needs.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, shadcn/ui, Recharts, Zustand |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (httpOnly cookie) + Resend (email) |
| State | Zustand (auth store only) |

---

## Data model — two collections

Everything in the app flows from just two business collections.

### Customer
Represents a client you work with.

```
name               String   required
email              String   required, unique, lowercase
plan               String   enum: enterprise | pro | starter | free  (default: free)
status             String   enum: active | churned                    (default: active)
acquisitionChannel String   enum: organic | paid | referral | direct | social
ltv                Number   lifetime value in $, auto-calculated from paid transactions (default: 0)
createdAt          Date     auto
updatedAt          Date     auto
```

### Transaction
Represents a single payment event tied to a client.

```
customer           ObjectId  ref → Customer, required
customerName       String    denormalised copy of customer.name (avoids joins on reads)
amount             Number    required
type               String    enum: service | product | subscription, required
status             String    enum: paid | pending | failed | refunded  (default: paid)
description        String    what the payment was for
date               Date      when it happened (default: now)
createdAt          Date      auto
updatedAt          Date      auto
```

`customerName` is stored directly on the transaction so the Payments and Insights pages can display customer names without joining back to the Customer collection on every read.

`ltv` on Customer is kept in sync by the transactions controller: it increments when a transaction is marked paid, and decrements if a paid transaction is later changed to another status.

---

## Backend structure

```
backend/src/
├── app.js                        Express app — mounts all routers
├── index.js                      Entry point — connects DB, starts server
├── config/
│   └── database.js               Mongoose connect
├── middleware/
│   └── verifyToken.js            JWT cookie check — guards all business routes
├── models/
│   ├── user.model.js             Auth only (not part of business logic)
│   ├── customer.model.js
│   └── transaction.model.js
├── controllers/
│   ├── dashboard.controller.js   Overview aggregations
│   ├── customers.controller.js   CRUD for clients
│   ├── transactions.controller.js CRUD + summary for payments
│   ├── insights.controller.js    Revenue analytics
│   ├── reports.controller.js     Period-based revenue reports
│   ├── user.controller.js        signup / login / logout
│   └── auth.controller.js        verify email / forgot + reset password
├── routes/
│   ├── user.route.js             /api/v1/auth/*
│   ├── dashboard.route.js        /api/v1/dashboard
│   ├── customers.route.js        /api/v1/customers/*
│   ├── transactions.route.js     /api/v1/transactions/*
│   ├── insights.route.js         /api/v1/insights
│   └── reports.route.js          /api/v1/reports
└── seeds/
    └── seed.js                   Dev data — 5 clients, 25 transactions
```

---

## API endpoints

All business routes require a valid JWT cookie. Unauthenticated requests return `401 Unauthorized`.

### Auth — `/api/v1/auth`
| Method | Path | What it does |
|---|---|---|
| POST | `/register` | Create account, send verification email |
| POST | `/login` | Validate credentials, set JWT cookie |
| POST | `/logout` | Clear JWT cookie |
| POST | `/verify-email` | Confirm 6-digit code from email |
| POST | `/forgot-password` | Send reset link via Resend |
| POST | `/reset-password/:token` | Set new password using token from email |
| GET  | `/check-auth` | Validate current session, return user object |

### Dashboard — `/api/v1/dashboard`
| Method | Path | What it does |
|---|---|---|
| GET | `/` | Returns all overview data in one payload |

Single endpoint, one round-trip. Runs 6 parallel MongoDB aggregations and returns:
- `revenueData` — 12-month chart (revenue + target line)
- `channelData` — acquisition channel breakdown (%)
- `activity` — last 5 transactions shaped as an activity feed
- `metrics` — 4 KPI cards (total revenue, active clients, churn rate, avg LTV)
- `plans` — plan distribution bars
- `miniStats` — MRR, ARR, NPS, CSAT

### Customers — `/api/v1/customers`
| Method | Path | What it does |
|---|---|---|
| GET | `/` | Paginated list with optional `search`, `plan`, `status` filters + global stats |
| POST | `/` | Create a new client |
| GET | `/:id` | Single client + their last 10 transactions |
| PUT | `/:id` | Update client fields |
| DELETE | `/:id` | Remove client |

### Transactions — `/api/v1/transactions`
| Method | Path | What it does |
|---|---|---|
| GET | `/` | Paginated list with optional `status`, `type` filters + revenue summary |
| POST | `/` | Record a new payment (auto-updates client LTV if paid) |
| PUT | `/:id` | Update a transaction (LTV adjusts if paid status changes) |
| DELETE | `/:id` | Remove a transaction |

### Insights — `/api/v1/insights`
| Method | Path | What it does |
|---|---|---|
| GET | `/` | Analytics: revenue by type, 12-month trend, top 5 clients, MoM growth summary |

### Reports — `/api/v1/reports`
| Method | Path | What it does |
|---|---|---|
| GET | `/` | Period report — accepts `period` (monthly/quarterly) and `year` query params |

---

## Frontend structure

```
frontend/src/
├── App.jsx                       Router — public vs protected route split
├── Layouts/
│   ├── MainLayout.jsx            Sidebar + <Outlet> for protected pages
│   └── PublicLayout.jsx          Wrapper for public pages
├── routes/
│   ├── ProtectedRoutes.jsx       Redirects to /login if not authenticated
│   └── PublicRoute.jsx           Redirects to /dashboard if already logged in
├── store/
│   └── authStore.js              Zustand — holds user, isAuthenticated, all auth actions
├── pages/
│   ├── public/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── verifyEmail.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── Reset-password.jsx
│   └── protected/
│       ├── Dashboard.jsx         Overview — charts + KPIs
│       ├── Payments.jsx          Transaction list
│       ├── Customers.jsx         Client list
│       ├── Insights.jsx          Revenue analytics
│       ├── Reports.jsx           Period reports
│       ├── Billing.jsx           (placeholder)
│       ├── Invoices.jsx          (placeholder)
│       ├── PaymentMethods.jsx    (placeholder)
│       ├── Settings.jsx          (placeholder)
│       └── Subscriptions.jsx     (placeholder)
└── components/ui/                shadcn/ui component library
```

---

## App flow

### 1. First load

```
Browser hits http://localhost:5173
  → App.jsx mounts
  → useEffect calls checkAuth() from authStore
      → GET /api/v1/auth/check-auth
      → If valid JWT cookie: sets user + isAuthenticated = true
      → If no/expired cookie: sets isAuthenticated = false
  → ProtectedRoutes reads isAuthenticated
      → true  → render the requested protected page
      → false → redirect to /login
```

### 2. Login flow

```
User fills Login form → submits
  → authStore.login(form)
      → POST /api/v1/auth/login
      → Server validates email + bcrypt password
      → Sets httpOnly JWT cookie (15 days)
      → Returns { user }
  → Store sets user + isAuthenticated = true
  → Navigate to /dashboard
```

### 3. Dashboard page load

```
/dashboard mounts
  → fetch(VITE_DASHBOARD_URL, { credentials: "include" })
      → GET /api/v1/dashboard
      → verifyToken middleware reads JWT from cookie
      → getDashboardData runs 6 parallel aggregations:
          1. Transaction.aggregate → 12-month revenue grouped by month
          2. Transaction.find      → last 5 transactions (activity feed)
          3. Customer.aggregate    → total/active/churned counts + avg LTV
          4. Customer.aggregate    → count per plan
          5. Customer.aggregate    → count per acquisition channel
          6. Transaction.aggregate → this month's paid total (MRR)
      → Returns single JSON payload
  → React sets dashData state
  → Renders: KPI cards, revenue chart, channel chart, activity feed, plan bars, mini stats
```

### 4. Payments page load

```
/payments mounts (or filters change)
  → fetch(`VITE_TRANSACTIONS_URL?page=1&limit=20&status=...&type=...`)
      → GET /api/v1/transactions
      → getTransactions runs 3 parallel queries:
          1. Transaction.find(filter).skip().limit() → paginated rows
          2. Transaction.countDocuments(filter)      → total for pagination
          3. Transaction.aggregate                   → summary (totalRevenue, pending, successRate, count)
      → Returns { transactions, total, pages, summary }
  → Renders: 4 summary cards, filter tabs (status), filter pills (type), table, pagination
```

### 5. Customers page load

```
/customers mounts (or search/filter/page changes)
  → fetch(`VITE_CUSTOMERS_URL?page=1&limit=20&search=...&plan=...`)
      → GET /api/v1/customers
      → getCustomers runs 3 parallel queries:
          1. Customer.find(filter).skip().limit() → paginated rows
          2. Customer.countDocuments(filter)      → total for pagination
          3. Customer.aggregate                   → global stats (ignores active filter)
      → Returns { customers, total, pages, stats }
  → Renders: 4 stat cards, search input, plan filter pills, table, pagination
  → Note: search is debounced 350 ms so it doesn't fire on every keystroke
```

### 6. Insights page load

```
/insights mounts
  → fetch(VITE_INSIGHTS_URL)
      → GET /api/v1/insights
      → getInsights runs 7 parallel queries (all on Transaction + Customer):
          1. Revenue by type (service/product/subscription) with % share
          2. 12-month revenue trend grouped by month
          3. Top 5 clients by total paid
          4. This month's revenue total
          5. Last month's revenue total
          6. Total customer count
          7. New customers this month
      → Returns { revenueByType, monthlyRevenue, topCustomers, summary }
  → Renders: 4 KPI cards, 12-month area chart, income-by-type bar chart, top clients table
```

### 7. Reports page load

```
/reports mounts (or period/year controls change)
  → fetch(`VITE_REPORTS_URL?period=monthly&year=2026`)
      → GET /api/v1/reports
      → getReports runs 2 parallel aggregations:
          1. Group by month or quarter → revenue + transaction count per period
          2. Group by type → revenue + count per type for the selected year
      → Returns { byPeriod, byType, totalRevenue, totalTransactions }
  → Renders: controls (monthly/quarterly toggle, year selector), 2 summary cards,
             bar chart, revenue-by-type breakdown table with share bars
```

### 8. Logout

```
User clicks "Log out" in sidebar
  → MainLayout.handleLogout()
      → authStore.logout()
          → POST /api/v1/auth/logout
          → Server clears the JWT cookie
      → Store sets user = null, isAuthenticated = false
  → navigate("/login")
```

---

## Key design decisions

**All business data flows from 2 models.** Customer and Transaction are the only collections the business logic touches. The dashboard, insights, and reports pages all compute their numbers from Transaction aggregations at request time — no pre-computed summaries stored separately. This means numbers are always accurate and there's no sync problem.

**`customerName` is denormalised onto Transaction.** Every transaction stores the client's name directly. This means the Payments page can render a full transaction list without a JOIN back to Customer. The trade-off is that if a client's name changes, old transactions still show the old name — acceptable for a billing ledger.

**LTV is kept live.** When a transaction is created with `status: "paid"`, the customer's `ltv` field is incremented by `amount`. When a paid transaction is updated to any other status, `ltv` is decremented by the original amount. This means the Customers page always shows an accurate lifetime value without re-aggregating.

**One fetch per page.** Each dashboard page makes a single API call on mount. The backend batches all related aggregations with `Promise.all` before responding. This keeps the frontend simple — no waterfall requests, no loading skeletons per section.

**JWT in httpOnly cookies.** The token is never accessible to JavaScript. The frontend passes `credentials: "include"` on every fetch so the browser attaches the cookie automatically. All protected routes go through the `verifyToken` middleware before reaching any controller.

---

## Environment variables

### Backend (`backend/.env`)
```
MONGODB_URI=        MongoDB Atlas connection string
PORT=               Server port (default 4000)
SECRET=             JWT signing secret
RESEND_API_KEY=     Resend API key for transactional email
CLIENT_URL=         Frontend URL for CORS (http://localhost:5173)
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=           http://localhost:4000/api/v1/auth
VITE_DASHBOARD_URL=     http://localhost:4000/api/v1/dashboard
VITE_TRANSACTIONS_URL=  http://localhost:4000/api/v1/transactions
VITE_CUSTOMERS_URL=     http://localhost:4000/api/v1/customers
VITE_INSIGHTS_URL=      http://localhost:4000/api/v1/insights
VITE_REPORTS_URL=       http://localhost:4000/api/v1/reports
```

---

## Running the project

```bash
# Seed the database (run once)
cd backend
node src/seeds/seed.js

# Start backend (port 4000)
npm run dev

# Start frontend (port 5173) — in a second terminal
cd frontend
npm run dev
```

Open `http://localhost:5173`. Register an account, verify your email, then log in.
