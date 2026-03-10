# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobial is an eSIM ecommerce platform built on Next.js 16 (App Router) with MobiMatter B2B API integration for product sourcing and Stripe for payments. Users browse eSIM data plans by country, purchase via Stripe checkout, and receive eSIM activation details (QR codes, LPA strings).

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Dev server on port 3000 (logs to dev.log)
bun run build            # Production build (standalone output)
bun run start            # Production server via Bun runtime
bun run lint             # ESLint

# Database
bun run db:generate      # Generate Prisma client
bun run db:push          # Push schema to database
bun run db:migrate       # Run migrations (dev)

# Data
bun run seed:admin       # Create admin user (scripts/seed-admin.js)
bun run sync:products    # Sync products from MobiMatter API (scripts/sync-products.js)
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router, React 19, TypeScript
- **Prisma** with SQLite (dev) / PostgreSQL (prod)
- **Tailwind CSS 4** + **shadcn/ui** (components in `src/components/ui/`)
- **Stripe** for payments, **MobiMatter** for eSIM product sourcing
- **Bun** as package manager and production runtime
- **NextAuth.js** for session management, custom JWT auth for API routes

### Path Alias
`@/*` maps to `src/*`

### Key Directories
- `src/app/api/` — RESTful API routes
- `src/services/` — Business logic (product-service, order-service, esim-service)
- `src/lib/` — Utilities and integrations (db, mobimatter, stripe, jwt, encryption, rate-limit)
- `src/components/` — React components organized by domain (ui, admin, auth, store, common)
- `src/contexts/` — Cart context (shopping cart state)
- `src/hooks/` — Custom hooks (admin-auth, api-error, mobile, toast, pwa)
- `prisma/schema.prisma` — Database schema (~20 models)
- `scripts/` — Admin seeding and product sync scripts

### API Pattern
All API routes use standardized responses via `src/lib/api-response.ts` (`successResponse()` / `errorResponse()`). Input validation uses Zod schemas. Auth endpoints are rate-limited. Admin routes require ADMIN role enforced by middleware.

### Authentication Flow
1. Custom JWT auth: login returns access + refresh token pair
2. NextAuth.js wraps session on the client side
3. 2FA support via TOTP (Google Authenticator) + backup codes
4. Rate limiting on auth endpoints (5 attempts/15 min), account lockout on failures
5. Middleware (`src/middleware.ts`) enforces RBAC on `/admin` and `/api/admin` routes

### Order Flow
1. User selects product → adds to cart (CartContext)
2. Checkout creates Stripe session (`POST /api/checkout/session`)
3. Stripe webhook confirms payment → order created via MobiMatter API
4. eSIM details (ICCID, QR code, activation code) stored and displayed to user

### MobiMatter Integration
`src/lib/mobimatter.ts` is the API client — handles product fetching, order creation/completion, eSIM status, data usage, topups, refunds, and wallet balance. Credentials are AES-encrypted at rest.

### Database
- SQLite for dev (`dev.db` at project root), PostgreSQL for prod
- Soft deletes throughout (GDPR compliance) — never hard-delete records
- Prisma client singleton in `src/lib/db.ts`

## Environment Variables

Required in `.env`:
```
DATABASE_URL          # "file:./dev.db" for local
JWT_SECRET
ENCRYPTION_KEY        # Hex-format AES key
MOBIMATTER_MERCHANT_ID
MOBIMATTER_API_KEY
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_BASE_URL  # "http://localhost:3000" for local
```

## Build & Deploy

Production build outputs standalone bundle. The build step copies static assets into the standalone directory. Deployed behind Caddy reverse proxy (see `Caddyfile`). TypeScript build errors are ignored in `next.config.ts`.
