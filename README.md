# Flocheq — SaaS Payments Dashboard

A full-stack payments management platform, built for software businesses that bill international clients across services, subscriptions, and products. Flocheq gives developers and founders a single workspace to track revenue, manage customers, and monitor transaction health — without depending on a third-party dashboard.

> **Status:** Core platform built and tested. Currently integrating payment processors and account balance infrastructure.

---

## Why I Built This

Most SaaS founders start by bolting Stripe onto their product and spending hours cross-referencing dashboards to understand their revenue picture. Flocheq is the layer that sits on top — a clean, developer-first interface for tracking what's coming in, from whom, and in what form.

---

## Live Features

### Authentication System
A production-grade auth flow built entirely from scratch — no Passport, no Auth0.

- **Registration** with full validation (name, email, password strength, confirm password)
- **Email verification** — 6-digit OTP token generated with Node's `crypto` module, expiry enforced at the database level via `verificationTokenExpiresAt`
- **Login** — credentials verified against bcrypt hash; session established via signed JWT
- **Forgot / Reset password** — crypto-generated reset token scoped to a 1-hour expiry, delivered by email, invalidated on use
- **`checkAuth`** — silent session restore on every app load using the stored cookie; concurrent login race condition handled in Zustand with a functional setter so `checkAuth` never overwrites a freshly authenticated session
- **Route protection** — `ProtectedRoutes` and `PublicRoutes` wrappers redirect at the React Router level; `verifyToken` middleware protects every API endpoint server-side
- **Registration gating** — `blockRegistration` middleware allows the API to be locked down for invite-only or closed-beta launches

### Payments
- Transaction table backed by real MongoDB data with server-side filtering and pagination
- Filter by **status**: All / Paid / Pending / Failed / Refunded
- Filter by **type**: All / Service / Product / Subscription
- Summary cards: Total received, Pending balance, Success rate, Transaction count

### Customers
- Customer table with **live debounced search** (350ms delay to avoid hammering the API)
- Filter by **plan tier**: Enterprise / Pro / Starter / Free
- Stats: Total customers, Active, Churned, Average LTV

### Dashboard Overview
- KPI summary cards with period-over-period change indicators
- **Revenue vs Target** area chart (Recharts)
- **Acquisition Channels** bar chart
- Recent activity feed

### Other Pages
- **Insights** — aggregated analytics by period
- **Reports** — exportable summaries
- **Billing** — current plan, billing cycle, payment method, next invoice
- **Settings** — organisation details, security, notification preferences

---

## Skills & Technologies

### Frontend
| Skill | Usage |
|-------|-------|
| **React 19** | Component architecture, hooks (`useState`, `useEffect`, `useNavigate`) |
| **Vite** | Build tooling and dev server |
| **Tailwind CSS v4** | Utility-first styling, dark mode via class strategy |
| **shadcn/ui + Radix UI** | Accessible, unstyled component primitives (Button, Card, Badge, Avatar, Separator) |
| **Zustand** | Global auth state; functional setters used to resolve async race conditions |
| **React Router v7** | Nested routes, layout routes, redirect guards (`ProtectedRoutes`, `PublicRoutes`) |
| **Recharts** | Area chart (revenue), Bar chart (acquisition) with custom tooltips |
| **Lucide React** | Icon library |
| **Geist font** | Variable font for a clean developer aesthetic |

### Backend
| Skill | Usage |
|-------|-------|
| **Node.js + Express 5** | REST API, middleware pipeline |
| **MongoDB + Mongoose** | Document storage, schema validation, ODM |
| **Mongoose pre-save hooks** | Auto-hashes password on create and update; only re-hashes if `password` field is modified |
| **bcrypt** | Password hashing at cost factor 10 |
| **JSON Web Tokens (JWT)** | Stateless auth; signed with `SECRET` env var, decoded in `verifyToken` middleware |
| **HTTP-only cookies** | JWT stored in a cookie unreachable by JavaScript — mitigates XSS token theft |
| **Node `crypto`** | Cryptographically random token generation for email verification and password reset |
| **Resend** | Transactional email delivery (welcome, reset password, reset success) |
| **CORS** | Configured with `credentials: true` and explicit origin so cookies travel cross-origin |
| **dotenv** | Environment variable management |

### Data Models
```
User          — auth fields, verification token, reset token, timestamps
Customer      — name, email, plan, status, LTV, channel, joined date
Transaction   — customer ref, amount, type (service/product/subscription),
                status (paid/pending/failed/refunded), description, date
```

### Testing
| Skill | Usage |
|-------|-------|
| **Playwright** | End-to-end testing across Chromium, Firefox, and WebKit |
| **UI-driven tests** | Every test interacts with real form inputs and buttons — no API shortcuts |
| **Global setup** | Seed script runs before every test run to guarantee a known test user state |
| **Cross-browser** | All specs run against three browser engines in parallel |

**Test coverage:** auth flow, sidebar navigation, dashboard, payments filters, customer search, settings, billing — 60+ assertions.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   React SPA (Vite)               │
│  PublicLayout ─ AuthLayout ─ MainLayout          │
│  Zustand authStore  ←→  HTTP-only cookie         │
└──────────────────┬──────────────────────────────┘
                   │ fetch (credentials: include)
┌──────────────────▼──────────────────────────────┐
│              Express REST API (:4000)            │
│  verifyToken middleware on all protected routes  │
│  /api/v1/auth  /dashboard  /customers            │
│  /transactions  /insights  /reports              │
└──────────────────┬──────────────────────────────┘
                   │ Mongoose ODM
┌──────────────────▼──────────────────────────────┐
│                  MongoDB Atlas                   │
│     User   Customer   Transaction                │
└─────────────────────────────────────────────────┘
```

---

## Planned Integrations

The platform is production-ready at the infrastructure level. The next layer is plugging in payment processors and building user account balance management.

- **Stripe** — process real payments, sync transaction status via webhooks, issue payouts
- **User account balances** — wallet model tracking available balance, pending funds, and transaction history per user (model stubbed, controller and routes in progress)
- **Webhook handling** — inbound event processing for payment status updates
- **Multi-currency** — exchange rate conversion for international clients

---

## Getting Started

```bash
# 1. Backend
cd backend
cp .env.example .env        # MONGODB_URI, SECRET, RESEND_API_KEY, CLIENT_URL
npm install
npm run dev                 # http://localhost:4000

# 2. Frontend
cd frontend
cp .env.example .env        # VITE_API_URL, VITE_DASHBOARD_URL, etc.
npm install
npm run dev                 # http://localhost:5173

# 3. E2E Tests (both servers must be running)
cd playwright
npx playwright test
```

---



---

## Author

Built by **Ndivho Mafunise** — a full-stack developer focused on developer tooling and financial infrastructure for modern software businesses.
