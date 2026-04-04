# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run tests (Vitest)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

To run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

## Architecture Overview

**ShopSure** is a Next.js 16 App Router frontend for a multi-tenant e-commerce marketplace. It has two portals: an **admin portal** (`/admin`) and a **seller portal** (`/seller`). The backend API is separate (localhost:3001 in dev, Render in production).

### Key Technology Choices

- **React Query (TanStack v5)** — all data fetching and server state; no Redux/Zustand
- **React Hook Form + Zod** — form state and validation
- **Shadcn UI** (Radix UI + Tailwind CSS v4) — component library, components live in `src/components/ui/`
- **Axios** — HTTP client configured in `src/lib/axios.ts` with interceptors for auth and token refresh
- **Vitest + React Testing Library** — testing in jsdom environment

### Route Structure

```
/admin/(authenticated)/    # Admin portal (ADMIN role required)
/seller/(dashboard)/       # Seller portal (SELLER role required)
/seller/onboarding         # Seller KYC registration
/verification/             # Email verification flows
```

Route protection is handled by middleware in `src/proxy.ts`, which decodes JWT from cookies using `jose`, checks `role` and seller `status`, and redirects accordingly.

### Auth Flow

1. Tokens stored as httpOnly cookies (access + refresh)
2. `src/proxy.ts` (Next.js middleware) enforces role-based access — ADMIN vs SELLER
3. `src/lib/axios.ts` interceptors: attach Bearer token on requests, queue requests during token refresh on 401, redirect to login on refresh failure
4. Safe callback URL utilities in `src/lib/safe-callback-url.ts` prevent open redirects

### API Service Layer

```
src/services/api.ts                 # Generic apiService wrapper (get/post/put/patch/delete)
src/services/auth.service.ts        # Auth endpoints
src/services/seller-product.service.ts  # Seller product CRUD
src/services/admin-product.service.ts   # Admin product management
src/services/category.service.ts    # Category management
src/services/media.service.ts       # Image uploads
```

All services use the generic `apiService` from `api.ts`. Type definitions for API responses live in `src/types/`.

### Component Organization

```
src/components/ui/         # Shadcn base components (don't modify these directly)
src/components/seller/     # Seller-specific feature components
src/components/admin/      # Admin-specific feature components
src/hooks/                 # Custom hooks (useProductForm is the most complex — handles multi-image upload, variants, attributes)
src/providers/             # React context providers (QueryClientProvider)
src/data/                  # Mock/static data for development
```

### Forms

The product form pattern (`src/hooks/useProductForm.ts`) is the most complex in the codebase — it manages multi-file image uploads with preview, dynamic variants and attributes, discount calculation, and auto-SKU generation. Follow this pattern when building other complex forms.

### Path Aliases

`@/*` resolves to `src/*` (configured in tsconfig.json).
