# 📦 MobiMatter B2B Order Flow - Complete Guide

## 🎯 Overview

Based on the official MobiMatter API documentation, here's the complete order lifecycle.

---

## 🔄 Order Lifecycle

### Step 1: Get Products (One-time setup)
```
GET /api/v2/products
```
- Fetches product catalog
- Products change infrequently → **Cache these!**
- Recommended: Cache for 24 hours or until product update webhook

**Response:**
```json
{
  "products": [
    {
      "id": "75b98dc7-c026-48c1-9fee-465681382d39",
      "title": "Test 1GB",
      "providerName": "Test Provider",
      "price": 0.01,
      "currencyCode": "USD",
      ...
    }
  ]
}
```

---

### Step 2: Create Order (Customer checkout)
```
POST /api/v2/orders
Body: {
  "productId": "xxx",
  "quantity": 1,
  "customerEmail": "customer@example.com",
  "customerPhone": "+1234567890" (optional)
}
```

**What happens:**
- ✅ Order created in **PENDING** state
- ✅ Line items reserved in cart
- ✅ Total amount **AUTHORIZED** from your wallet (not yet captured)
- ⏳ Order waits for completion

**Response:**
```json
{
  "orderId": "ORD-123456",
  "status": "pending",
  "total": 10.00,
  "currency": "USD"
}
```

**Important:** At this stage, the amount is only **authorized**, not captured. You have ~15 minutes to complete the order before authorization expires.

---

### Step 3: Complete Order (After payment confirmed)
```
POST /api/v2/orders/{orderId}/complete
```

**What happens:**
- ✅ Order status changes to **COMPLETED**
- ✅ Authorized amount **CAPTURED** from wallet
- ✅ eSIM details returned (QR code, activation code, ICCID)
- ✅ Order ready for delivery

**Response:**
```json
{
  "orderId": "ORD-123456",
  "status": "completed",
  "lineItems": [
    {
      "productId": "xxx",
      "quantity": 1,
      "qrCode": "data:image/png;base64,...",
      "activationCode": "LPA:1$smdp.example.com$ABC123",
      "iccid": "8944501234567890123",
      "smdpAddress": "smdp.example.com"
    }
  ]
}
```

---

### Step 4: Notify User (Send email)
```
POST /api/v2/orders/{orderId}/notify
Body: {
  "email": "customer@example.com"
}
```

**What happens:**
- ✅ MobiMatter sends order confirmation email to customer
- ✅ Email contains eSIM QR code and activation instructions
- ✅ Customer can activate eSIM immediately

**Response:**
```json
{
  "success": true,
  "messageId": "MSG-789"
}
```

---

## 💳 Complete Payment Flow

### Customer Perspective
```
1. Browse products → See cached catalog
2. Add to cart → Local state
3. Checkout → Enter email, payment info
4. Pay → Stripe charges customer's card
5. Receive email → eSIM QR code & instructions
6. Activate → Scan QR code, eSIM active
```

### Your Platform Perspective
```
1. Customer adds to cart → Store in database/session
2. Customer initiates checkout → Create MobiMatter order (PENDING)
3. Process Stripe payment → Charge customer's card
4. Payment successful → Complete MobiMatter order
5. Send notification → MobiMatter emails customer
6. Record transaction → Store order ID, ICCID, profit
```

### MobiMatter Wallet Perspective
```
1. Create Order → $10.00 AUTHORIZED (wallet balance shows -$10.00 pending)
2. Complete Order → $10.00 CAPTURED (wallet balance shows -$10.00 actual)
3. Notify User → Email sent (no wallet impact)
```

---

## 🧪 Testing Flow

### Use Test Products
MobiMatter provides test products that behave like real eSIMs but cost $0.01:

**Test Product IDs:**
- `2087df0d-9d5d-4035-83d0-3374e49fbaf2` - TopUp Test 1 GB ($0.01)
- `75b98dc7-c026-48c1-9fee-465681382d39` - Test 1GB ($0.01)
- `24f5ebfc-4335-4227-9ef6-d9482502e32e` - Test 2GB ($0.01)

### Test Complete Flow
```bash
# 1. Get products
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/products" \
  -H "merchantId: YOUR_MERCHANT_ID" \
  -H "api-key: YOUR_API_KEY"

# 2. Create order
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/orders" \
  -H "merchantId: YOUR_MERCHANT_ID" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "75b98dc7-c026-48c1-9fee-465681382d39",
    "quantity": 1,
    "customerEmail": "test@example.com"
  }'

# 3. Complete order
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/orders/ORD-123/complete" \
  -H "merchantId: YOUR_MERCHANT_ID" \
  -H "api-key: YOUR_API_KEY"

# 4. Notify user
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/orders/ORD-123/notify" \
  -H "merchantId: YOUR_MERCHANT_ID" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## ⚠️ Important Notes

### Authorization Timeout
- After **Create Order**, you have **~15 minutes** to complete
- If not completed, authorization expires and items return to inventory
- Wallet amount is released back to available balance

### Wallet Balance
- **Before Create Order:** $100.00 available
- **After Create Order:** $90.00 available ($10.00 pending)
- **After Complete Order:** $90.00 available ($10.00 captured)
- **After Cancel Order:** $100.00 available ($10.00 released)

### Error Handling
- **Insufficient funds:** Create Order fails with 402
- **Product unavailable:** Create Order fails with 404
- **Order already completed:** Complete Order fails with 400
- **Invalid email:** Notify User fails with 400

### Caching Strategy
```typescript
// Product catalog changes infrequently
// Cache for 24 hours or until webhook notification

const CACHE_KEY = 'mobimatter_products';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getProducts() {
  const cached = await cache.get(CACHE_KEY);
  if (cached) return cached;
  
  const products = await fetchProducts();
  await cache.set(CACHE_KEY, products, CACHE_TTL);
  return products;
}
```

---

## 📊 Order Status Reference

| Status | Description | Can Complete? | Can Cancel? | Wallet Impact |
|--------|-------------|---------------|-------------|---------------|
| `pending` | Order created, amount authorized | ✅ Yes | ✅ Yes | Authorized |
| `completed` | Order fulfilled, amount captured | ❌ No | ❌ No | Captured |
| `cancelled` | Order cancelled, amount released | ❌ No | ❌ No | Released |
| `refunded` | Order refunded, amount returned | ❌ No | ❌ No | Returned |

---

## 🔧 Implementation Checklist

### Backend
- [ ] Implement product caching (24 hour TTL)
- [ ] Create order endpoint (2-step: create → complete)
- [ ] Integrate Stripe payment processing
- [ ] Handle authorization timeout (15 minute window)
- [ ] Implement order status tracking
- [ ] Add webhook for product catalog updates

### Frontend
- [ ] Product listing with cached data
- [ ] Shopping cart functionality
- [ ] Checkout form (email, phone optional)
- [ ] Payment form (Stripe Elements)
- [ ] Order confirmation page
- [ ] Order history page

### Error Handling
- [ ] Insufficient wallet funds
- [ ] Product out of stock
- [ ] Payment failed
- [ ] Authorization timeout
- [ ] Email delivery failure

---

## 📞 Testing Checklist

### Before Going Live
- [ ] Test with test products ($0.01 orders)
- [ ] Verify wallet deductions
- [ ] Test complete order flow end-to-end
- [ ] Verify email delivery
- [ ] Test error scenarios
- [ ] Verify order status updates
- [ ] Test with real email addresses
- [ ] Verify QR codes scan correctly
- [ ] Test order usage checking
- [ ] Test refund/cancellation flow

---

**Ready to implement? Start with the test endpoint at `/api/b2b/test-all`!**

Last Updated: March 7, 2026
Version: 1.0
