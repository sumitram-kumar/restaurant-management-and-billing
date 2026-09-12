# Restaurant Management & Billing

[![CI](https://github.com/sumitram-kumar/restaurant-management-and-billing/actions/workflows/ci.yml/badge.svg)](https://github.com/sumitram-kumar/restaurant-management-and-billing/actions/workflows/ci.yml)

A billing and menu-management system for a small restaurant: staff log in, manage the menu, ring up an itemized invoice with discount and GST, and pull sales/tax reports over a date range.

This project started as a college assignment and was later rebuilt end-to-end - TypeScript on both sides, a normalized Prisma/Postgres schema, real server-side authorization and bill computation, automated tests, and CI - as a portfolio piece.

## Architecture

```
client/   React 18 + TypeScript, MUI, Auth0 SPA login
              |  REST, Bearer token
              v
api/      Express + TypeScript, Prisma ORM
              |
              v
          PostgreSQL
```

- **`api/`** - Express API in `src/`, organized by feature module (`modules/menu`, `modules/tax`, `modules/bills`, `modules/stats`), each with `routes -> controller -> service`. Zod validates every request; a centralized error handler maps validation/Prisma/auth errors to proper HTTP status codes; `express-oauth2-jwt-bearer` verifies Auth0 access tokens on everything under `/api`. See [`api/prisma/schema.prisma`](api/prisma/schema.prisma) for the data model.
- **`client/`** - Create React App + TypeScript. `CatalogContext` and `BillContext` hold shared state (menu/tax data, the in-progress invoice draft) instead of the prop-drilling the original version used. `ProtectedRoute` gates every authenticated page via Auth0's `withAuthenticationRequired`. All API access goes through `src/api/*` - no component talks to `axios` or a hardcoded URL directly.

### A design decision worth calling out

In the original version, an invoice's subtotal/discount/tax/total were computed **in the browser** and only reached the database when the receipt was printed - meaning a skipped print silently lost the sale, and nothing stopped a modified request from submitting arbitrary amounts. The rewrite moved that computation server-side: the client sends only item IDs, quantities, a discount percentage, and a payment mode; the API looks up current prices and the active tax rate itself, computes the bill in a pure, unit-tested function ([`billCalculator.ts`](api/src/modules/bills/billCalculator.ts)), and persists it immediately on submission. `api/test/integration/bills.routes.test.ts` sends a request with a forged price/amount and asserts the server ignores it.

## Tech stack

| | |
|---|---|
| **Frontend** | React 18, TypeScript, MUI, React Router, Auth0 React SDK, Axios |
| **Backend** | Node.js, Express, TypeScript, Prisma, Zod, Pino |
| **Database** | PostgreSQL 16 |
| **Auth** | Auth0 (Authorization Code + PKCE on the frontend, JWT bearer verification on the API) |
| **Testing** | Vitest + Supertest (API), Jest + React Testing Library (client) |
| **CI** | GitHub Actions |

## Local setup

### 1. Database

Either run Postgres directly:

```bash
brew install postgresql@16
brew services start postgresql@16
createdb billing
createdb billing_test
```

or via Docker Compose (also what CI effectively mirrors):

```bash
docker compose up -d
```

### 2. Auth0

You need an Auth0 tenant with:

1. An **Application** (Single Page Application) for login - gives you a `domain` and `clientId`.
2. An **API** (Applications → APIs → Create API) - gives you an `Identifier`, used as the `audience`. The Identifier can be any unique string (e.g. `https://your-app-name-api`); it doesn't need to resolve to anything.

### 3. Backend

```bash
cd api
cp .env.example .env        # fill in DATABASE_URL / AUTH0_AUDIENCE / AUTH0_ISSUER_BASE_URL
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev                 # http://localhost:5000
```

### 4. Frontend

```bash
cd client
cp .env.example .env        # fill in REACT_APP_AUTH0_* and REACT_APP_API_BASE_URL
npm install
npm start                   # http://localhost:3000
```

## Testing

```bash
# api - spins up against DATABASE_URL from api/.env.test (copy api/.env.test.example)
cd api && npm test

# client
cd client && npm run test:ci
```

Both `npm run lint` and `npm run typecheck` are available in each package and run in CI alongside the test suite.

## Deployment

All three pieces run on free tiers, wired together with GitHub Actions:

| | Host | Deploys via |
|---|---|---|
| Frontend | GitHub Pages | `.github/workflows/deploy-pages.yml` on push to `master` |
| Backend | Render | `render.yaml` Blueprint, auto-deploys on push |
| Database | Supabase (Postgres) | provisioned once, migrations run on each backend deploy |

To stand this up from scratch:

1. **Database** — create a [Supabase](https://supabase.com) project, copy its connection string (Project Settings → Database → Connection string → URI, using the pooler/port 6543 for serverless-friendly connections).
2. **Backend** — on [Render](https://render.com), New → Blueprint, point it at this repo (it reads `render.yaml`). When prompted, paste the Supabase connection string in as `DATABASE_URL`. After the first deploy succeeds, run `npx prisma db seed` once against that `DATABASE_URL` locally to populate sample menu items.
3. **Frontend** — in this repo's Settings → Pages, set Source to "GitHub Actions". In Settings → Secrets and variables → Actions → Variables, add `REACT_APP_API_BASE_URL` pointing at the Render URL from step 2, then re-run the `Deploy frontend to GitHub Pages` workflow.
4. **Auth0** — in the existing Application's settings, add the GitHub Pages URL to Allowed Callback URLs, Allowed Logout URLs, and Allowed Web Origins.

## Known, deliberate gaps

- **CRA, not Vite.** `client/` still uses `react-scripts`. Migrating build tooling is orthogonal to the goals of this rewrite (TypeScript, auth, data modeling, tests) and would add risk without adding anything the app needs - noted here rather than left as a silent gap. `react-scripts`' own dependency tree carries a number of `npm audit` findings (webpack-dev-server, etc.) that are all dev-tooling-only and don't ship in the production build.
- **A moderate `qs` advisory via Express 4** has no fix currently published upstream that doesn't mean jumping to Express 5 (a breaking change out of scope here).
- **Tax rate history has no UI.** The API stores every tax rate ever set (append-only, so historical bills stay correct against the rate that applied when they were created), but there's no screen to browse that history - `UpdateTax` only shows the current rate.

## Contributors

- **Sumitram Kumar** - original application and this rewrite.
- **Sumaitri Shikha** - contributed to the original version of this project, including the initial billing calculation logic and menu structure this rewrite builds on.

## License

MIT - see [LICENSE.md](LICENSE.md).
