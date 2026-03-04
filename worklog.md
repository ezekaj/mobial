# MobiaL - MobiMatter Affiliate Platform

## Project Overview
Building a comprehensive full-stack affiliate platform for MobiMatter eSIM services.
- **Website**: Customer-facing eSIM store with affiliate tracking
- **Mobile App**: PWA (Progressive Web App) for cross-platform support
- **Security**: GDPR compliance, encryption, 2FA, audit logging
- **Integration**: MobiMatter Partner API for products and orders

## Architecture

### Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js with JWT + 2FA
- **Mobile**: PWA with offline support
- **Security**: AES-256 encryption, rate limiting, audit logs

### MobiMatter API Integration
- **Base URL**: `https://api.mobimatter.com/mobimatter`
- **Authentication**: `merchantId` + `api-key` headers
- **Products API**: `/api/v2/products`
- **Orders API**: Create and manage orders

---
Task ID: 1
Agent: Main Coordinator
Task: Initialize project architecture and database schema

Work Log:
- Analyzed MobiMatter Partner API documentation
- Identified key integration points
- Designing comprehensive database schema

Stage Summary:
- MobiMatter uses RESTful API with merchantId + api-key authentication
- Products can be fetched via GET /api/v2/products
- Orders are two-step: create order, then process payment from wallet
- Database schema designed with 20+ models covering all aspects

---
Task ID: 2
Agent: Main Coordinator
Task: Build core security and utility libraries

Work Log:
- Created encryption.ts: AES-256-GCM encryption for sensitive data
- Created password.ts: PBKDF2 password hashing with strength checking
- Created two-factor.ts: TOTP implementation for 2FA
- Created jwt.ts: JWT token generation and verification
- Created audit.ts: Comprehensive audit logging
- Created rate-limit.ts: Rate limiting with memory and database backends
- Created mobimatter.ts: MobiMatter API client

Stage Summary:
- All core security utilities implemented
- Encryption uses AES-256-GCM with proper key derivation
- 2FA supports TOTP and backup codes
- Audit logging captures all security-relevant events
- Rate limiting supports multiple endpoints with configurable limits

---
## Task ID: 4 - Backend API Routes Developer
### Work Task
Create comprehensive backend API routes for MobiaL platform authentication, 2FA, and user management.

### Work Summary

#### 1. Created Auth Helper Library (`src/lib/auth-helpers.ts`)
- `getAuthUser()` - Extract and verify user from Authorization header
- `requireAuth()` - Middleware that throws if not authenticated
- `requireAdmin()` - Middleware that throws if not admin
- Helper utilities: `jsonResponse`, `errorResponse`, `successResponse`, `parseJsonBody`, `getClientIP`, `getUserAgent`
- Type definitions: `AuthUser`, `AuthenticatedRequest`, `ApiResponse`

#### 2. Authentication Routes (`/api/auth/`)

**POST `/api/auth/register`**
- Validates input with Zod schema
- Checks password strength
- Creates user with CUSTOMER role and PENDING_VERIFICATION status
- Generates JWT access and refresh tokens
- Creates session record in database
- Logs audit event for account creation

**POST `/api/auth/login`**
- Rate limited: 5 attempts per 15 minutes per IP
- Verifies password with timing-safe comparison
- Handles account lockout after 5 failed attempts (30 min lock)
- Supports TOTP 2FA verification and backup codes
- Generates new token pair on successful login
- Updates last login timestamp and clears failed attempts
- Logs all login attempts (success/failure)

**POST `/api/auth/logout`**
- Invalidates session(s) - supports single session or all devices
- Logs logout audit event

**POST `/api/auth/refresh`**
- Verifies refresh token validity
- Checks session existence and expiration
- Generates new token pair
- Updates session with new refresh token

#### 3. Password Reset Routes (`/api/auth/password/`)

**POST `/api/auth/password/reset-request`**
- Rate limited: 3 per hour per IP
- Generates secure reset token with 1 hour expiry
- Stores token in SystemConfig (placeholder for production email sending)
- Returns generic success message to prevent email enumeration

**POST `/api/auth/password/reset`**
- Validates reset token and expiration
- Checks new password strength
- Updates password hash
- Invalidates all existing sessions for security
- Logs password change audit event

#### 4. Two-Factor Authentication Routes (`/api/auth/2fa/`)

**POST `/api/auth/2fa/enable`**
- Requires authentication
- Generates TOTP secret
- Returns QR code URL (otpauth:// format)
- Stores secret temporarily (10 min expiry)

**POST `/api/auth/2fa/verify`**
- Verifies TOTP code against secret
- Enables 2FA on successful verification
- Generates and returns 10 backup codes (hashed for storage)
- Logs 2FA enable audit event

**POST `/api/auth/2fa/disable`**
- Requires password, TOTP code, or backup code verification
- Clears 2FA settings and backup codes
- Logs 2FA disable audit event

#### 5. User Routes (`/api/user/`)

**GET `/api/user/me`**
- Returns current user info with counts (orders, unread notifications)
- Includes affiliate profile data if applicable

**PATCH `/api/user/me`**
- Updates name, phone, or avatar
- Logs profile update audit event

**POST `/api/user/export-data`**
- GDPR compliance - data portability
- Supports JSON and CSV formats
- Gathers all user data: profile, sessions, orders, affiliate data, notifications, audit logs
- Returns download URL with 7-day expiry

**POST `/api/user/delete-account`**
- GDPR compliance - right to erasure
- Requires password confirmation
- Checks for pending orders/payouts before allowing deletion
- Creates deletion request record
- Soft deletes account (anonymizes email, clears sensitive data)
- Invalidates all sessions
- 30-day recovery window before permanent deletion

### Security Features Implemented
- Rate limiting on sensitive endpoints
- Password strength validation
- Account lockout after failed attempts
- Session management with refresh tokens
- TOTP-based 2FA with backup codes
- Audit logging for all security events
- GDPR-compliant data export and deletion
- Timing-safe password comparison
- Email enumeration prevention

---
## Task ID: 3 - Frontend Developer
### Work Task
Create a professional, modern, responsive frontend for MobiaL eSIM Affiliate Platform with dark mode support.

### Work Summary

#### 1. Design System & Styling
**Updated `src/app/globals.css`:**
- Professional MobiaL color scheme with emerald/green primary (trust, success, money)
- Amber/orange accent color for CTAs and highlights
- Light and dark mode CSS variables
- Custom scrollbar styling
- Gradient utilities for hero sections
- Custom animation utilities (float, pulse-glow)

#### 2. Theme Provider
**Created `src/components/providers/theme-provider.tsx`:**
- Wrapper around next-themes ThemeProvider
- Enables system preference detection
- Supports light/dark mode toggle

#### 3. Layout Components

**`src/components/layout/header.tsx`:**
- Sticky header with backdrop blur
- Logo with gradient styling
- Desktop navigation links (Products, Affiliate Program, How It Works, About)
- Theme toggle button (sun/moon icons)
- Auth buttons (Login/Sign Up) or user dropdown menu
- Mobile hamburger menu with Sheet component
- Framer Motion animations

**`src/components/layout/footer.tsx`:**
- Multi-column footer layout
- Brand section with GDPR and security badges
- Quick links (Products, Affiliate, Company, Legal)
- Social media links
- Copyright and contact info

**`src/components/layout/mobile-nav.tsx`:**
- Full mobile navigation drawer
- Theme toggle within mobile menu
- Auth section with user info or login buttons
- Smooth transitions and animations

#### 4. Common Components

**`src/components/common/product-card.tsx`:**
- eSIM product card with provider logo placeholder
- Data amount and validity display
- Country coverage display
- Feature badges (Hotspot, Calls, SMS)
- Price with discount display
- Buy button with gradient styling
- Hover animations

**`src/components/common/feature-card.tsx`:**
- Feature highlight card with icon
- Staggered animation support
- Group hover effects

**`src/components/common/cta-section.tsx`:**
- Call-to-action section component
- Gradient background variants (primary/accent)
- Primary and secondary action buttons

**`src/components/common/stats-section.tsx`:**
- Statistics display grid
- Animated number counters
- Responsive layout

#### 5. Auth Components

**`src/components/auth/login-form.tsx`:**
- Email and password fields with icons
- Password visibility toggle
- Form validation with Zod
- Loading state with spinner
- Forgot password link
- Switch to register option

**`src/components/auth/register-form.tsx`:**
- Full registration form (name, email, password, confirm)
- Password strength requirements
- Terms acceptance checkbox
- Zod validation with password matching
- Loading state handling

**`src/components/auth/auth-modal.tsx`:**
- Modal wrapper using Dialog component
- Animated form switching (login ↔ register)
- Success callback handling

#### 6. Updated Main Layout
**Updated `src/app/layout.tsx`:**
- ThemeProvider wrapper for dark mode
- Updated metadata for SEO (MobiaL branding)
- OpenGraph and Twitter card meta tags

#### 7. Home Page
**Created comprehensive `src/app/page.tsx`:**
- **Hero Section**: Compelling headline, CTA buttons, floating phone mockup
- **Stats Section**: Countries, travelers, uptime, support
- **Featured Products**: 4 sample eSIM products with ProductCard
- **Features Section**: Why MobiaL (4 feature cards)
- **How It Works**: 4-step process with numbered steps
- **Affiliate Program**: Benefits and signup CTA
- **About Section**: Company info and trust signals
- **Final CTA Section**: Last call-to-action

All sections include:
- Framer Motion animations
- Responsive design (mobile-first)
- Accessibility attributes
- Professional styling

#### 8. Environment Configuration
**Updated `.env` with:**
- JWT_SECRET placeholder
- ENCRYPTION_KEY placeholder
- MOBIMATTER_MERCHANT_ID placeholder
- MOBIMATTER_API_KEY placeholder
- NextAuth configuration

### Technical Highlights
- All components are TypeScript with proper typing
- Uses existing shadcn/ui components (Button, Card, Badge, Dialog, Sheet, etc.)
- Mobile-first responsive design
- Dark mode support throughout
- Professional color scheme avoiding blue/indigo
- Smooth Framer Motion animations
- ESLint passes without errors
- Dev server running successfully on port 3000

---
## Task ID: 7 - Products API Developer
### Work Task
Create Products API for MobiaL - a MobiMatter eSIM Affiliate Platform. Build comprehensive backend API routes for product management including sync from MobiMatter API.

### Work Summary

#### 1. Created Product Service (`src/services/product-service.ts`)

**Core Functions:**
- `syncProductsFromMobimatter()` - Sync all products from MobiMatter API to database
  - Creates new products or updates existing ones
  - Handles errors gracefully with detailed error reporting
  - Returns sync statistics (created, updated, skipped, errors)
  - Marks products not in sync as inactive

- `getProductById(idOrSlug)` - Get single product by ID, slug, or MobiMatter ID

- `getProducts(filters)` - Get filtered and paginated products
  - Supports filtering by: country, region, provider, minPrice, maxPrice
  - Supports sorting by: price_asc, price_desc, name, validity, data, createdAt
  - Pagination with limit and offset

- `generateSlug(name)` - Generate URL-safe slug from product name
  - Appends number if slug already exists to ensure uniqueness

- `transformMobimatterProduct(raw)` - Transform API response to database format

- `getAvailableCountries()` - Get list of all countries with product counts

- `getAvailableProviders()` - Get list of all providers with product counts

- `getFeaturedProducts(limit)` - Get featured products

- `searchProducts(query)` - Search products by name, description, or provider

**Type Definitions:**
- `ProductFilters` - Filter options for product queries
- `PaginatedProducts` - Paginated response with products and metadata
- `ProductWithDetails` - Full product details with parsed JSON fields
- `SyncResult` - Sync operation result with statistics
- `CountryInfo` / `ProviderInfo` - Country and provider information

#### 2. Products API Routes (`/api/products/`)

**GET `/api/products`**
- List all active products with filtering and pagination
- Query params: country, region, provider, minPrice, maxPrice, sortBy, limit, offset, search
- Returns paginated products with total count and hasMore flag
- Validates all parameters and returns appropriate error messages

**GET `/api/products/[id]`**
- Get single product by ID, slug, or MobiMatter ID
- Returns 404 if not found

**POST `/api/products/sync` (Admin only)**
- Sync products from MobiMatter API to database
- Requires admin authentication via `requireAdmin()`
- Rate limited: 3 syncs per hour per admin user
- Logs sync start and completion in audit log
- Returns detailed sync statistics

**GET `/api/products/countries`**
- Get list of all available countries from products
- Returns unique country codes with names and product counts
- Sorted by product count (descending)

**GET `/api/products/providers`**
- Get list of all providers with product counts
- Sorted by product count (descending)

#### 3. Updated MobiMatter Client (`src/lib/mobimatter.ts`)
- Exported `Product` interface for use in other modules
- Client already returns all necessary fields for product sync

### Technical Highlights
- TypeScript throughout with proper typing
- Uses existing MobiMatter client from `src/lib/mobimatter.ts`
- Generates unique slugs (appends number if duplicate)
- Handles errors gracefully with detailed error messages
- Rate limiting on admin sync endpoint
- All admin actions logged in audit trail
- Proper HTTP status codes (200, 400, 401, 403, 404, 429, 500)
- ESLint passes without errors

---
## Task ID: 8 - Orders API Developer
### Work Task
Create comprehensive Orders API for MobiaL - a MobiMatter eSIM Affiliate Platform. Build backend API routes and services for order management, processing, and affiliate tracking.

### Work Summary

#### 1. Created Affiliate Tracking Helper (`src/lib/affiliate-tracking.ts`)

**Core Functions:**
- `validateAffiliateCode(code)` - Validate affiliate code and return affiliate info
- `getAffiliateByCode(code)` - Get affiliate profile by code
- `trackClick(data, request)` - Track affiliate click with IP/device fingerprinting
  - Prevents click spam (1 hour cooldown per IP)
  - Updates affiliate click stats
- `createCommission(orderId, affiliateId, orderTotal, commissionRate)` - Create commission record
- `convertClick(clickId, orderId, conversionValue)` - Mark click as converted and link to order
- `getAffiliateClick(clickId)` - Get click details with affiliate info
- `getPendingClicks(affiliateId, limit)` - Get pending clicks for an affiliate
- `getAffiliateEarnings(affiliateId)` - Calculate affiliate earnings summary
- `updateCommissionStatus(commissionId, status)` - Update commission status
- `cancelCommissionForOrder(orderId)` - Cancel commission when order is cancelled

**Type Definitions:**
- `AffiliateValidationResult` - Result of affiliate code validation
- `ClickTrackingData` - Data for tracking affiliate clicks

#### 2. Created Order Service (`src/services/order-service.ts`)

**Core Functions:**
- `generateOrderNumber()` - Generate unique order number (MBL-XXXXXXXX)
- `calculateOrderTotal(items)` - Calculate subtotal, discount, tax, and total
- `validateProducts(items)` - Validate products exist and are active
- `createOrder(data, userId?, ipAddress?, userAgent?)` - Create new order
  - Validates products and calculates totals
  - Handles affiliate tracking and click conversion
  - Generates unique order number
  - Creates order with items in transaction
  - Logs audit event
- `processOrderWithMobimatter(orderId, processedBy?)` - Process order via MobiMatter API
  - Updates status to PROCESSING
  - Creates MobiMatter order for each item
  - Stores eSIM details (QR code, activation code)
  - Handles affiliate commission creation
  - Updates status to COMPLETED or FAILED
- `getOrderByNumber(orderNumber)` - Get order by order number
- `getOrderById(orderId)` - Get order by ID with items and user
- `getUserOrders(userId, pagination)` - Get paginated orders for a user
- `getAllOrders(filters, pagination)` - Get all orders with filters (admin)
- `completeOrder(orderId, completedBy?)` - Mark order as completed
- `cancelOrder(orderId, reason, cancelledBy?)` - Cancel order
- `userOwnsOrder(userId, orderId)` - Check if user owns order
- `getOrderStats(userId?)` - Get order statistics for dashboard

**Type Definitions:**
- `CreateOrderItem` - Order item data for creation
- `CreateOrderData` - Complete order creation data
- `OrderTotals` - Calculated order totals
- `PaginationParams` - Pagination parameters
- `OrderFilters` - Filter options for order queries

#### 3. Created eSIM Service (`src/services/esim-service.ts`)

**Core Functions:**
- `getESIMDetails(orderId)` - Get eSIM details for an order
  - Returns QR code, activation code, ICCID, status
  - Includes product information
- `getESIMDetailsForItem(orderItemId)` - Get eSIM details for a specific item
- `generateQRCodeImage(qrString, size)` - Generate QR code image data URL
  - Uses Google Chart API with fallback to SVG generation
- `parseActivationString(activationString)` - Parse LPA format activation string
- `getUserESIMs(userId)` - Get all eSIMs for a user
- `syncESIMStatus(orderId)` - Sync eSIM status from MobiMatter

**Type Definitions:**
- `ESIMDetails` - Complete eSIM information
- `QRCodeImage` - Generated QR code image data

#### 4. Orders API Routes (`/api/orders/`)

**POST `/api/orders`**
- Create new order
- Accepts: `{ items: [{ productId, quantity }], email, phone?, affiliateCode?, affiliateClickId? }`
- Validates products exist and are active
- Calculates totals
- Generates unique order number (MBL-XXXXXXXX)
- Tracks affiliate click if code provided
- Creates order with PENDING status
- Logs audit event
- Works for both guests and authenticated users
- Returns order with order number

**GET `/api/orders`**
- Get user's orders (authenticated)
- Admin: get all orders with filters
- Query params: status, paymentStatus, limit, offset
- Returns paginated orders with items

**GET `/api/orders/[id]`**
- Get order by ID or order number
- Only owner or admin can access
- Returns full order details with items
- Includes eSIM details if order is completed
- Returns product information for each item

**POST `/api/orders/[id]/process` (Internal/Admin)**
- Process the order with MobiMatter API
- Calls MobiMatter createOrder for each item
- Stores eSIM details (QR code, activation code, etc.)
- Updates order status to PROCESSING then COMPLETED
- Calculates and creates affiliate commission
- Returns updated order with eSIM details

**POST `/api/orders/[id]/complete`**
- Mark order as completed
- Updates commission status to APPROVED
- Logs audit event
- Only admin or order owner can complete
- Returns updated order

**POST `/api/orders/[id]/cancel`**
- Cancel order (if not completed)
- Requires cancellation reason
- Updates status to CANCELLED
- Cancels commission if any
- Logs audit event
- Users can only cancel pending orders
- Returns updated order

### Key Features

**Order Management:**
- Guest and authenticated user orders supported
- Unique order number generation
- Product validation before order creation
- Automatic total calculation
- Order status workflow: PENDING → PROCESSING → COMPLETED/CANCELLED

**Affiliate Integration:**
- Click tracking with spam prevention
- Commission creation on order completion
- Click conversion tracking
- Commission cancellation on order cancellation

**eSIM Management:**
- QR code generation for eSIM activation
- Support for LPA format activation strings
- eSIM status tracking
- Sync with MobiMatter API

**Security:**
- Authentication required for user orders
- Admin-only endpoints for processing
- Owner verification for order access
- Audit logging for all order events

### Technical Highlights
- TypeScript throughout with proper typing
- Transaction support for order creation
- Error handling with appropriate HTTP status codes
- Follows existing project patterns and conventions
- ESLint passes without errors
- Dev server running successfully on port 3000

---
## Task ID: 9 - Affiliate System Developer
### Work Task
Create comprehensive affiliate system for MobiaL - a MobiMatter eSIM Affiliate Platform. Build backend API routes for affiliate registration, links, tracking, commissions, payouts, dashboard, and admin management.

### Work Summary

#### 1. Created Affiliate Service (`src/services/affiliate-service.ts`)

**Core Functions:**
- `generateAffiliateCode()` - Generate unique 8-character affiliate codes
  - Uses alphanumeric chars (excludes confusing I, O, 0, 1)
  - Ensures uniqueness by checking database
  
- `generateLinkCode()` - Generate unique 6-character link codes
  - Same approach as affiliate codes

- `hashIpAddress(ip)` / `hashDeviceId(deviceId)` - Privacy-compliant hashing
  - Uses SHA-256 with secret for GDPR compliance

- `registerAffiliate(userId, data)` - Register new affiliate
  - Creates AffiliateProfile with PENDING status
  - Generates unique affiliate code
  - Updates user role to AFFILIATE

- `getAffiliateProfile(userId)` - Get affiliate profile with user data

- `getAffiliateStats(affiliateId)` - Get comprehensive affiliate statistics
  - Total clicks, conversions, earnings, paid out
  - Pending earnings, conversion rate

- `trackClick(affiliateCode, trackingData, linkCode?)` - Track affiliate click
  - Validates affiliate is active
  - Captures IP (hashed), user agent, referrer, country, device fingerprint
  - Creates AffiliateClick record
  - Updates click counts on profile and link
  - Returns click ID and target URL

- `attributeConversion(clickId, orderId, orderAmount)` - Attribute conversion to click
  - Validates click exists and not already converted
  - Calculates commission using affiliate's rate
  - Creates Commission record
  - Updates conversion stats

- `calculateCommission(amount, rate)` - Calculate commission amount (rounded to 2 decimals)

- `getAffiliateDashboard(affiliateId)` - Get comprehensive dashboard data
  - Stats summary
  - Recent clicks (last 10)
  - Recent commissions (last 10)
  - Top performing links (top 5)
  - Earnings chart data (last 30 days)

- `requestPayout(affiliateId, amount)` - Request a payout
  - Minimum $50 threshold
  - Validates available balance
  - Creates Payout record with PENDING status

- `getCommissionStats(affiliateId)` - Get commission statistics
  - totalPending, totalApproved, totalPaid
  - thisMonth, lastMonth earnings

- `createAffiliateLink(affiliateId, data)` - Create new affiliate link
  - Generates unique short code
  - Sets target URL (custom, product-specific, or default)

- `getAffiliateLinks(affiliateId)` - Get all affiliate links with conversion rates

- `updateAffiliateProfile(userId, data)` - Update affiliate profile
  - Cannot change affiliate code

**Type Definitions:**
- `RegisterAffiliateData` - Registration input
- `AffiliateStats` - Statistics response
- `ClickTrackingData` - Click tracking input
- `DashboardData` - Full dashboard response
- `CommissionStats` - Commission statistics

#### 2. Affiliate Registration & Profile Routes (`/api/affiliate/`)

**POST `/api/affiliate/register`**
- Validates required fields (paymentMethod, paymentDetails)
- Validates payment method (bank, paypal, crypto, wise)
- Validates website URL if provided
- Creates affiliate profile with PENDING status
- Logs audit event

**GET `/api/affiliate/profile`**
- Returns affiliate profile with stats
- Includes commission rate, status, earnings data

**PATCH `/api/affiliate/profile`**
- Updates companyName, website, paymentMethod, paymentDetails, taxId
- Cannot change affiliate code
- Logs audit event

#### 3. Affiliate Links Routes (`/api/affiliate/links/`)

**GET `/api/affiliate/links`**
- Returns all affiliate links with click/conversion stats
- Includes full tracking URL

**POST `/api/affiliate/links`**
- Creates new affiliate link
- Accepts: name, productId, targetUrl
- Requires active affiliate status
- Returns link with full tracking URL

**DELETE `/api/affiliate/links/[id]`**
- Deletes an affiliate link
- Verifies ownership

#### 4. Tracking Routes (`/api/track/[code]`)

**GET `/api/track/[code]?ref=AFFILIATE_CODE`**
- Tracks affiliate click
- Captures: IP, user agent, referrer, country (from headers), device fingerprint
- Creates AffiliateClick record
- Sets tracking cookie (30 day expiry)
- Redirects to target URL
- Graceful fallback on errors (redirects to home)

#### 5. Commissions Routes (`/api/affiliate/commissions/`)

**GET `/api/affiliate/commissions`**
- Returns paginated commissions
- Query params: status, startDate, endDate, limit, offset
- Includes order info (orderNumber, total)

**GET `/api/affiliate/commissions/stats`**
- Returns commission statistics
- totalPending, totalApproved, totalPaid, thisMonth, lastMonth

#### 6. Payouts Routes (`/api/affiliate/payouts/`)

**GET `/api/affiliate/payouts`**
- Returns paginated payout history
- Query params: status, limit, offset

**POST `/api/affiliate/payouts/request`**
- Requests a payout
- Minimum $50 threshold
- Validates available balance
- Creates Payout record with PENDING status
- Logs audit event

#### 7. Dashboard Stats Route (`/api/affiliate/dashboard`)

**GET `/api/affiliate/dashboard`**
- Returns comprehensive dashboard data
- Profile info, stats summary
- Recent clicks, recent commissions
- Top performing links
- Earnings chart data (last 30 days daily breakdown)

#### 8. Admin Routes for Affiliate Management (`/api/admin/affiliates/`)

**GET `/api/admin/affiliates`**
- Lists all affiliates (admin only)
- Query params: status, search, limit, offset
- Search across: affiliateCode, companyName, user email/name

**PATCH `/api/admin/affiliates/[id]/approve`**
- Approves affiliate application
- Sets status to ACTIVE
- Sets approvedAt timestamp
- Logs audit event

**PATCH `/api/admin/affiliates/[id]/suspend`**
- Suspends an affiliate
- Sets status to SUSPENDED
- Optional reason parameter
- Logs audit event

**PATCH `/api/admin/affiliates/[id]/commission-rate`**
- Updates affiliate's commission rate
- Validates range (0% to 50%)
- Logs audit event

### Security Features Implemented
- IP addresses hashed for privacy (GDPR compliance)
- Device fingerprints hashed for privacy
- Affiliate codes must be unique
- Minimum payout threshold enforced ($50)
- Admin actions logged in audit trail
- Payment method validation
- Website URL validation
- Commission rate bounds checking
- Proper HTTP status codes throughout

### Files Created
- `src/services/affiliate-service.ts` - Core business logic
- `src/app/api/affiliate/register/route.ts` - Registration endpoint
- `src/app/api/affiliate/profile/route.ts` - Profile endpoints
- `src/app/api/affiliate/links/route.ts` - Links endpoints
- `src/app/api/affiliate/links/[id]/route.ts` - Link by ID endpoint
- `src/app/api/track/[code]/route.ts` - Click tracking endpoint
- `src/app/api/affiliate/commissions/route.ts` - Commissions endpoint
- `src/app/api/affiliate/commissions/stats/route.ts` - Commission stats endpoint
- `src/app/api/affiliate/payouts/route.ts` - Payouts endpoint
- `src/app/api/affiliate/payouts/request/route.ts` - Payout request endpoint
- `src/app/api/affiliate/dashboard/route.ts` - Dashboard endpoint
- `src/app/api/admin/affiliates/route.ts` - Admin list affiliates
- `src/app/api/admin/affiliates/[id]/approve/route.ts` - Admin approve
- `src/app/api/admin/affiliates/[id]/suspend/route.ts` - Admin suspend
- `src/app/api/admin/affiliates/[id]/commission-rate/route.ts` - Admin rate update

### Technical Highlights
- TypeScript throughout with comprehensive type definitions
- Uses Prisma ORM for all database operations
- Privacy-compliant IP/device hashing

---
Task ID: 10
Agent: Main Coordinator
Task: Complete PWA support and Admin Dashboard

Work Log:
- Added PWA (Progressive Web App) support for mobile app experience
  - Created manifest.json with app configuration
  - Created service worker for offline support
  - Added usePWA hook for install prompts
  - Created offline fallback page
- Created comprehensive Admin Dashboard
  - Admin layout with sidebar navigation and mobile responsive design
  - Dashboard home with stats, quick actions, and recent activity
  - Affiliates management page with search, filter, approve/suspend actions
  - Orders management page with process and cancel functionality
  - Settings page for platform configuration
- Created Admin Stats API endpoint
  - Aggregates all platform statistics
  - Returns counts for affiliates, orders, revenue, commissions
- Verified all linting passes

Stage Summary:
- PWA support enables mobile app-like experience with offline support
- Admin dashboard provides full control over the platform
- All code passes lint checks
- Dev server running successfully on port 3000
